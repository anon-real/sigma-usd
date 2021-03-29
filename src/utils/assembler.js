import { get, post } from './rest';
import { addReq, getForKey, getUrl, setForKey, showStickyMsg } from './helpers';
import { boxesByAddress, txById, txConfNum } from './explorer';
import { toast } from 'react-toastify';
import { assemblerUrl } from './consts';

export const txFee = 3000000;

export async function follow(request) {
    return await post(getUrl(assemblerUrl) + '/follow', request).then((res) =>
        res.json()
    ).then(res => {
        if (res.success === false) throw new Error();
        return res;
    });
}

export async function stat(id) {
    return await get(getUrl(assemblerUrl) + '/result/' + id);
}

export async function p2s(request) {
    return await post(getUrl(assemblerUrl) + '/compile', request).then((res) =>
        res.json()
    ).then(res => {
        if (res.success === false) throw new Error();
        return res;
    });
}

async function resolvePending() {
    let key = 'operation'
    let reqs = getForKey(key).filter(req => req.miningStat.includes('pending'));
    for (let i = 0; i < reqs.length; i++) {
        let info = JSON.parse(JSON.stringify(reqs[i]))
        let confNum = await txConfNum(info.txId);
        let miningStat = confNum ? 'mined' : 'pending';
        if (miningStat === 'mined') {
            if (info.miningStat.includes('refund')) info.miningStat = 'refund mined';
            else info.miningStat = 'mined';
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
                }
            }
        }
    }
}

export async function reqFollower() {
    let reqs = getForKey('reqs');
    if (reqs.length > 0) console.log('following ' + reqs.length + ' requests...');
    let newReqs = [];
    for (let i = 0; i < reqs.length; i++) {
        try {
            let req = reqs[i];
            let out = await stat(req.id);

            if (out.id !== undefined && out.detail !== 'timeout') {
                let req = reqs.find((cur) => cur.id === out.id);
                newReqs.push(req);
                if (out.detail !== 'success' && out.detail !== 'returning') {
                    continue;
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

