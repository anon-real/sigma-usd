import { get, post } from './rest';
import { addReq, getForKey, getUrl, getWalletAddress, setForKey, showStickyMsg } from './helpers';
import { boxesByAddress, getSpendingTx, getTxsFor, getUnconfirmedTxsFor, txById, txConfNum } from './explorer';
import { toast } from 'react-toastify';
import { assemblerUrl, bankAddress } from './consts';

import JSONBigInt from "json-bigint"
export const JSON = JSONBigInt({useNativeBigInt: true})

export const txFee = 5000000;
export const returnFee = 1200000;

export function getTxFee() {
    const key = 'txFee';
    let fee = localStorage.getItem(key);
    if (fee === null) fee = txFee;
    else fee = parseInt(fee);
    return fee
}

export function setTxFee(txFee) {
    const key = 'txFee';
    localStorage.setItem(key, txFee);
}

export async function follow(request) {
    return await post(getUrl(assemblerUrl) + '/follow', request).then((res) =>
        res.json()
    ).then(res => {
        if (res.success === false) throw new Error();
        return res;
    });
}

export async function broadcast(tx) {
    console.log(tx)
    return await post(getUrl(assemblerUrl) + '/broadcast', tx).then((res) =>
        res.json()
    ).then(res => {
        if (res.success === false) throw new Error();
        return res;
    });
}

export async function stat(id) {
    return await get(getUrl(assemblerUrl) + '/result/' + id);
}

export async function getBankBox() {
    return await get(getUrl(assemblerUrl) + '/getBankBox');
}

export async function getOraclekBox() {
    return await get(getUrl(assemblerUrl) + '/getOracleBox');
}

export async function getHeight() {
    return (await get(getUrl(assemblerUrl) + '/getHeight')).height
}

export async function getPreHeaders() {
    return (await get(getUrl(assemblerUrl) + '/getPreHeaders'))
}

export async function p2s(request) {
    return await post(getUrl(assemblerUrl) + '/compile', request).then((res) =>
        res.json()
    ).then(res => {
        if (res.success === false) throw new Error();
        return res;
    });
}

export async function getAddressFunds(amount, asset) {
    const address = getWalletAddress();
    return (await get(getUrl(assemblerUrl) + `/getFunds/${address}/${asset}/${amount}`))
}

export async function resolveNautilus() {
    let key = 'operation'
    let reqs = getForKey(key).filter(req => req.miningStat.includes('pending'));
    reqs = reqs.filter(req => req.isNautilus);
    for (let i = 0; i < reqs.length; i++) {
        let info = JSON.parse(JSON.stringify(reqs[i]))
        let confNum = await txConfNum(info.txId);
        let miningStat = confNum ? 'mined' : 'pending';
        if (miningStat === 'mined') {
            info.miningStat = 'mined';
            info.tx = undefined;
            info.status = 'success';
            addReq(info, key, 'id');
            toast.info(`Your operation to "${info.type}" is done!`);

        } else {
            let tx = info.tx
            const oracleTx = await getSpendingTx(tx.dataInputs[0].boxId);
            const bankTx = await getSpendingTx(tx.inputs[0].boxId);
            let failed = bankTx !== null && bankTx !== undefined && bankTx.spentTransactionId !== tx.id
            failed = failed || (oracleTx !== null && oracleTx !== undefined && bankTx === null)
            if (failed) {
                info.status = 'fail';
                info.txId = tx.id;
                info.tx = undefined;
                let prev = getForKey(key).filter(prev => prev.id === info.id);
                if (prev.length === 0 || prev[0].status !== info.status) {
                    toast.error(`Your operation to "${info.type}" has failed! Your assets have not left your wallet. You can try increasing the miner to increase the success probability.`);
                }
                info.miningStat = `try again`;
                info.status = 'fail';
                addReq(info, key, 'id');
            }
        }
    }
}

async function resolvePending() {
    let key = 'operation'
    let reqs = getForKey(key).filter(req => req.miningStat.includes('pending'));
    reqs = reqs.filter(req => !req.isNautilus);
    for (let i = 0; i < reqs.length; i++) {
        let info = JSON.parse(JSON.stringify(reqs[i]))
        console.log(reqs[i])
        let confNum = await txConfNum(info.txId);
        let miningStat = confNum ? 'mined' : 'pending';
        if (miningStat === 'mined') {
            if (info.miningStat.includes('refund')) info.miningStat = 'refund mined';
            else info.miningStat = miningStat;
            addReq(info, key, 'id');

        } else {
            let boxes = await boxesByAddress(info.address)
            if (boxes.length > 0 && boxes[0].spentTransactionId) {
                let tx = await txById(boxes[0].spentTransactionId)
                if (tx.outputs[0].address === info.returnTo) {
                    info.status = 'fail';
                    info.txId = boxes[0].spentTransactionId
                    let prev = getForKey(key).filter(prev => prev.id === info.id);
                    if (prev.length === 0 || prev[0].status !== info.status) {
                        toast.error(`Your operation to "${info.type}" has failed. Your assets are being returned to you and is pending mining - follow it in the History table..`);
                    }
                    info.miningStat = `refund mined`;
                    addReq(info, key, 'id');
                } else {
                    info.miningStat = `pending`;
                    info.txId = boxes[0].spentTransactionId
                    addReq(info, key, 'id');
                }
            }
        }
    }
}

export async function reqFollower() {
    let reqs = getForKey('reqs');
    let newReqs = [];
    for (let i = 0; i < reqs.length; i++) {
        try {
            let req = reqs[i];
            let out = await stat(req.id);

            if (out.id !== undefined && out.detail !== 'timeout') {
                let req = reqs.find((cur) => cur.id === out.id);
                newReqs.push(req);
                if (out.detail !== 'success' && out.detail !== 'returning') {
                    const txs = await getTxsFor(req.address);
                    const returnTx = txs.filter(tx => tx.outputs[0].address === req.returnTo);
                    const doneTxs = txs.filter(tx => tx.outputs[0].address === bankAddress);
                    if (returnTx.length > 0) {
                        out.tx = returnTx[0];
                        out.detail = 'returning';
                    }
                    else if (doneTxs.length > 0) {
                        out.tx = doneTxs[0];
                        out.detail = 'success';
                    } else {
                        continue;
                    }
                }

                let info = JSON.parse(JSON.stringify(req.info));
                info.txId = out.tx.id;
                info.id = req.id;
                let confNum = await txConfNum(info.txId);
                let miningStatus = confNum ? 'mined' : 'pending';
                if (confNum >= 2) {
                    newReqs.pop();
                }

                if (out.detail === 'success') {
                    info.status = 'success';
                    let prev = getForKey(req.key).filter(prev => prev.id === info.id);
                    if (prev.length === 0 || prev[0].status !== info.status) {
                        toast.success(`Your operation to "${info.type}" is done and pending mining - follow it in the History table.`);
                    }
                    info.miningStat = miningStatus;
                    addReq(info, req.key, 'id');

                } else if (out.detail === 'returning') {
                    info.status = 'fail';
                    let prev = getForKey(req.key).filter(prev => prev.id === info.id);
                    if (prev.length === 0 || prev[0].status !== info.status) {
                        toast.error(`Your operation to "${info.type}" has failed. Your assets are being returned to you and is pending mining - follow it in the History table..`);
                    }
                    info.miningStat = `refund ${miningStatus}`;
                    addReq(info, req.key, 'id');
                }

            } else {
                let info = JSON.parse(JSON.stringify(req.info));
                info.status = 'timeout';
                addReq(info, 'timeout');
            }
        } catch (e) {
        }
    }
    let reqsAfter = getForKey('reqs');
    reqsAfter.forEach(req => {
        let found = reqs.find((cur) => cur.id === req.id);
        if (!found) newReqs.push(req);
    });

    setForKey(newReqs, 'reqs');
    await resolvePending();
}

export async function returnFunds(fromAddress, toAddress) {
    return  get(getUrl(assemblerUrl) + `/return/${fromAddress}/${toAddress}`);
}
