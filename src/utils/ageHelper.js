/* global BigInt */
import { get } from './rest';
import { getWalletAddress } from './helpers';
import { getHeight, getOraclekBox, getTxFee } from './assembler';
import { dollarToCent } from './serializer';
import { implementor } from './consts';
import { getUnconfirmedTxsFor } from './explorer';
import { explorerEndpoint, oracleNftId } from './consts';
import { BankService } from './bankService';
import JSONBigInt from 'json-bigint';
import { sigUsdTokenId, sigRsvTokenId, bankNftId } from './consts';
import { transformBankBox } from './helpers';

export const JSON = JSONBigInt({ useNativeBigInt: true });
let ergolib = import('ergo-lib-wasm-browser')
let ageusd = import('ageusd');

const considerUnconfirmed = true;
let bankService = null;

export async function scTokenId() {
    return sigUsdTokenId;
}

export async function rcTokenId() {
    return sigRsvTokenId;
}

export async function bankNFTId() {
    return bankNftId;
}

export async function forceUpdateExp() {
    let body = await get(`${explorerEndpoint}/boxes/unspent/byTokenId/${bankNftId}`);

    if (considerUnconfirmed) {
        let box = body.items[0];
        let addr = box.address;
        let unc = await getUnconfirmedTxsFor(addr);

        let outBanks = [box];
        let inIds = [];
        unc.forEach((tx) => {
            if (
                tx.outputs[0].assets
                    .map((asset) => asset.tokenId)
                    .includes(bankNftId) &&
                tx.inputs[0].address === tx.outputs[0].address
            ) {
                outBanks = outBanks.concat([tx.outputs[0]]);
                inIds = inIds.concat([tx.inputs[0].id]);
            }
        });
        let notSpent = outBanks.filter(
            (bank) => !inIds.includes(bank.boxId) && !inIds.includes(bank.id)
        );
        if (notSpent.length === 1) {
            body = {
                items: [notSpent[0]]
            };
        } else if (notSpent.length > 1) {
            body = {
                items: [notSpent[0]]
            };
            console.error('bank boxes length is ' + notSpent.length, notSpent);
        }
    }

    let bankBox = body.items[0];
    bankBox = transformBankBox(bankBox);

    let oracleBox = await get(`${explorerEndpoint}/boxes/unspent/byTokenId/${oracleNftId}`);
    oracleBox = transformBankBox(oracleBox.items[0]);
    bankService = new BankService(bankBox, oracleBox);
}

export async function forceUpdateState() {
    await forceUpdateExp();
}

export async function updateState() {
    if (!bankService) await forceUpdateState();
}

export async function priceToMintSc(amount) {
    if (dollarToCent(amount) === 0) return 0;
    await updateState();
    return bankService.totalCostToMintStablecoin(dollarToCent(amount), getTxFee());
}

export async function priceToMintRc(amount) {
    if (parseInt(amount) === 0) return 0;
    await updateState();
    return bankService.totalCostToMintReservecoin(parseInt(amount), getTxFee());
}

export async function amountFromRedeemingSc(amount) {
    if (dollarToCent(amount) === 0) return 0;
    await updateState();
    return bankService.amountFromRedeemingStablecoin(dollarToCent(amount), getTxFee());
}

export async function amountFromRedeemingRc(amount) {
    if (parseInt(amount) === 0) return 0;
    await updateState();
    return bankService.amountFromRedeemingReservecoin(parseInt(amount), getTxFee());
}

export async function feeToMintSc(amount) {
    if (dollarToCent(amount) === 0) return 0;
    await updateState();
    const total = await bankService.totalCostToMintStablecoin(dollarToCent(amount), getTxFee());
    const base = await bankService.getSigPrice(dollarToCent(amount));
    return total - base;
}

export async function feeToMintRc(amount) {
    if (parseInt(amount) === 0) return 0;
    await updateState();
    const total = await bankService.totalCostToMintReservecoin(parseInt(amount), getTxFee());
    const base = await bankService.getRsvPrice(parseInt(amount));
    return total - base;
}

export async function feeFromRedeemingSc(amount) {
    if (dollarToCent(amount) === 0) return 0;
    await updateState();
    const total = await bankService.amountFromRedeemingStablecoin(dollarToCent(amount), getTxFee());
    const base = await bankService.getSigPrice(dollarToCent(amount));
    return base - total;
}

export async function feeFromRedeemingRc(amount) {
    if (parseInt(amount) === 0) return 0;
    await updateState();
    const total = await bankService.amountFromRedeemingReservecoin(parseInt(amount), getTxFee());
    const base = await bankService.getRsvPrice(parseInt(amount));
    return base - total;
}

export async function mintScTx(amount) {
    await updateState();
    const height = await getHeight();
    const addr = getWalletAddress();
    return await bankService.mintStablecoinTx(amount, addr, height, getTxFee());
}

export async function mintRcTx(amount) {
    await updateState();
    const height = await getHeight();
    const addr = getWalletAddress();
    return await bankService.mintReservecoinTx(amount, addr, height, getTxFee());
}

export async function redeemScTx(amount) {
    await updateState();
    const height = await getHeight();
    const addr = getWalletAddress();
    const tx = await bankService.redeemStablecoinTx(amount, addr, height, getTxFee());
    if (!tx) return null;

    // Format tx to match WASM output
    tx.requests.splice(2, 1);
    tx.inputs[1] = '$userIns';
    return tx;
}

export async function redeemRcTx(amount) {
    await updateState();
    const height = await getHeight();
    const addr = getWalletAddress();
    const tx = await bankService.redeemReservecoinTx(Math.floor(amount), addr, height, getTxFee());
    if (!tx) return null;

    // Format tx to match WASM output
    tx.requests.splice(2, 1);
    tx.inputs[1] = '$userIns';
    return tx;
}

export async function maxRcToRedeem() {
    await updateState();
    const reserveRatio = await bankService.getReserveRatio();
    if (reserveRatio <= 400) return 0;
    const equity = Number(await bankService.getEquity());
    const rsvNominal = Number(await bankService.getRsvNominal());
    return equity / rsvNominal;
}

export async function maxScToMint() {
    await updateState();
    const reserveRatio = await bankService.getReserveRatio();
    if (reserveRatio <= 400) return 0;
    const equity = Number(await bankService.getEquity());
    const sigNominal = Number(await bankService.getSigNominal());
    return equity / sigNominal;
}

export async function maxRcToMint() {
    await updateState();
    const reserveRatio = await bankService.getReserveRatio();
    if (reserveRatio >= 800) return 0;
    const circ = await rcNumCirc();
    const rcForReserve = Math.floor(circ / reserveRatio);
    return rcForReserve * (800 - reserveRatio);
}

export async function ableRcToRedeem(amount) {
    await updateState();
    const equity = Number(await bankService.getEquity());
    const rsvNominal = Number(await bankService.getRsvNominal());
    return equity >= rsvNominal * amount;
}

export async function ableScToMint(amount) {
    await updateState();
    return bankService.ableToMintStablecoin(amount);
}

export async function ableRcToMint(height, amount) {
    await updateState();
    return bankService.ableToMintReservecoin(amount);
}

export async function scPrice() {
    await updateState();
    return Number(await bankService.getSigNominal());
}

export async function rcPrice() {
    if (!bankService) return NaN;
    return Number(await bankService.getRsvNominal());
}

export async function scNumCirc() {
    await updateState();
    return Number(await bankService.getCircSig());
}

export async function rcNumCirc() {
    await updateState();
    return Number(await bankService.getCircRsv());
}

export async function currentReserveRatio() {
    await updateState();
    return Number(await bankService.getReserveRatio());
}

export async function baseReserves() {
    await updateState();
    return await bankService.getEquity();
}

export async function ergBalance(bal) {
    return bal['erg'] || 0;
}

export async function scBalance(bal) {
    return bal[await scTokenId()] || 0;
}

export async function rcBalance(bal) {
    return bal[await rcTokenId()] || 0;
}
