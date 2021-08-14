import { Address, Explorer } from '@coinbarn/ergo-ts';
import { get } from './rest';

const explorer = Explorer.mainnet;
export const explorerApi = 'https://api.ergoplatform.com/api/v0';

async function getRequest(url) {
    return get(explorerApi + url).then(res => {
        return { data: res };
    });
}

export async function currentHeight() {
    // return explorer.getCurrentHeight();
    return getRequest('/blocks?limit=1')
        .then(res => res.data)
        .then(res => res.items[0].height);
}

export function unspentBoxesFor(address) {
    return getRequest(`/transactions/boxes/byAddress/unspent/${address}`).then(
        (res) => res.data
    );
}

export function boxById(id) {
    return getRequest(`/transactions/boxes/${id}`).then((res) => res.data);
}

export function txById(id) {
    return getRequest(`/transactions/${id}`).then((res) => res.data);
}

export function boxesByAddress(address) {
    return getRequest(`/transactions/boxes/byAddress/${address}`).then((res) => res.data);
}

export async function txConfNum(id) {
    let tx = await txById(id)
    if (tx.summary === undefined) return 0
    else return tx.summary.confirmationsCount
}

export async function getSpendingTx(boxId) {
    const data = getRequest(`/transactions/boxes/${boxId}`);
    return data
        .then((res) => res.data)
        .then((res) => res.spentTransactionId)
        .catch((_) => null);
}

export function sendTx(tx) {
    explorer.broadcastTx(tx);
}

export function getUnconfirmedTxsFor(addr) {
    return getRequest(
        `/transactions/unconfirmed/byAddress/${addr}`
    )
        .then((res) => res.data)
        .then((res) => res.items);
}

export function getBalanceFor(addr) {
    return getRequest(
        `/addresses/${addr}`
    )
        .then((res) => res.data)
        .then((res) => res.transactions)
        .then(res => {
            let bal = {}
            bal['erg'] = res.confirmedBalance
            res.confirmedTokensBalance.forEach(tok => bal[tok.tokenId] = tok.amount)
            return bal
        });
} 

export async function getCirculatingSupply() {
    return getRequest('/info').then(res => res.data?.supply);
}
