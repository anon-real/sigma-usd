/* global BigInt */

import { get } from './rest';
import { getWalletAddress, isWalletSaved } from './helpers';
import { txFee } from './assembler';
import { dollarToCent } from './serializer';
import { currentHeight, getBalanceFor, getUnconfirmedTxsFor } from './explorer';
import { implementor } from './consts';

let ageusd = import('ageusd');

const considerUnconfirmed = true;
let explorerEndpoint = 'https://api.ergoplatform.com/api';
let bankBox = undefined;
let oracleBox = undefined;

export async function scTokenId() {
    return new (await ageusd).StableCoinProtocol().stablecoin_token_id;
}

export async function rcTokenId() {
    return new (await ageusd).StableCoinProtocol().reservecoin_token_id;
}

export async function bankNFTId() {
    return new (await ageusd).StableCoinProtocol().bank_nft_id;
}

export async function forceUpdateState() {
    let age = await ageusd;

    let body = await get(age.BankBox.w_explorer_endpoint(explorerEndpoint));
    if (considerUnconfirmed) {
        let bankNFT = new age.StableCoinProtocol().bank_nft_id;
        let box = body.items[0];
        let addr = box.address;
        let unc = await getUnconfirmedTxsFor(addr);

        let outBanks = [box];
        let inIds = [];
        unc.forEach((tx) => {
            if (
                tx.outputs[0].assets
                    .map((asset) => asset.tokenId)
                    .includes(bankNFT) &&
                tx.inputs[0].address === tx.outputs[0].address
            ) {
                outBanks = outBanks.concat([tx.outputs[0]]);
                inIds = inIds.concat([tx.inputs[0].id]);
            }
        });
        console.log(inIds, outBanks)
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
    bankBox = age.BankBox.w_process_explorer_response(JSON.stringify(body))[0];

    body = JSON.stringify(
        await get(age.ErgUsdOraclePoolBox.w_explorer_endpoint(explorerEndpoint))
    );
    oracleBox = age.ErgUsdOraclePoolBox.w_process_explorer_response(body)[0];
}

export async function updateState() {
    if (!bankBox || !oracleBox) await forceUpdateState();
}

export async function priceToMintSc(amount) {
    if (dollarToCent(amount) === 0) return 0;

    await updateState();
    return Number(
        bankBox.total_cost_to_mint_stablecoin(
            BigInt(dollarToCent(amount)),
            oracleBox,
            BigInt(txFee)
        )
    );
}

export async function priceToMintRc(amount) {
    if (parseInt(amount) === 0) return 0;

    await updateState();
    return Number(
        bankBox.total_cost_to_mint_reservecoin(
            BigInt(parseInt(amount)),
            oracleBox,
            BigInt(txFee)
        )
    );
}

export async function amountFromRedeemingSc(amount) {
    if (dollarToCent(amount) === 0) return 0;

    await updateState();
    return Number(
        bankBox.total_amount_from_redeeming_stablecoin(
            BigInt(dollarToCent(amount)),
            oracleBox,
            BigInt(txFee)
        )
    );
}

export async function amountFromRedeemingRc(amount) {
    if (parseInt(amount) === 0) return 0;

    await updateState();
    return Number(
        bankBox.total_amount_from_redeeming_reservecoin(
            BigInt(parseInt(amount)),
            oracleBox,
            BigInt(txFee)
        )
    );
}

export async function feeToMintSc(amount) {
    if (dollarToCent(amount) === 0) return 0;

    await updateState();
    return Number(
        bankBox.fees_from_minting_stablecoin(
            BigInt(dollarToCent(amount)),
            oracleBox,
            BigInt(txFee)
        )
    );
}

export async function feeToMintRc(amount) {
    if (parseInt(amount) === 0) return 0;

    await updateState();
    return Number(
        bankBox.fees_from_minting_reservecoin(
            BigInt(parseInt(amount)),
            oracleBox,
            BigInt(txFee)
        )
    );
}

export async function feeFromRedeemingSc(amount) {
    if (dollarToCent(amount) === 0) return 0;

    await updateState();
    return Number(
        bankBox.fees_from_redeeming_stablecoin(
            BigInt(dollarToCent(amount)),
            oracleBox,
            BigInt(txFee)
        )
    );
}

export async function feeFromRedeemingRc(amount) {
    if (parseInt(amount) === 0) return 0;

    await updateState();
    return Number(
        bankBox.fees_from_redeeming_reservecoin(
            BigInt(parseInt(amount)),
            oracleBox,
            BigInt(txFee)
        )
    );
}

export async function mintScTx(amount) {
    await updateState();

    let age = await ageusd;
    let height = await currentHeight();
    let addr = getWalletAddress();
    let pr = new age.StableCoinProtocol();
    let prc = BigInt(await priceToMintSc(amount)) + 1000000n;
    let res = pr.w_assembler_mint_stablecoin(
        BigInt(dollarToCent(amount)),
        addr,
        BigInt(txFee),
        BigInt(height),
        oracleBox,
        bankBox,
        prc,
        implementor
    );
    res = JSON.parse(res);
    res.requests.splice(3, 1);
    res.requests[1].value += res.requests[2].value
    res.requests.splice(2, 1);
    res.inputs[1] = '$userIns';
    return res;
}

export async function mintRcTx(amount) {
    await updateState();

    let age = await ageusd;
    let height = await currentHeight();
    let addr = getWalletAddress();
    let pr = new age.StableCoinProtocol();
    let prc = BigInt(await priceToMintRc(amount)) + 1000000n;
    let res = pr.w_assembler_mint_reservecoin(
        BigInt(Math.floor(amount)),
        addr,
        BigInt(txFee),
        BigInt(height),
        oracleBox,
        bankBox,
        prc,
        implementor
    );
    res = JSON.parse(res);
    res.requests.splice(3, 1);
    res.requests[1].value += res.requests[2].value
    res.requests.splice(2, 1);
    res.inputs[1] = '$userIns';
    return res;
}

export async function redeemScTx(amount) {
    await updateState();

    let age = await ageusd;
    let height = await currentHeight();
    let addr = getWalletAddress();
    let pr = new age.StableCoinProtocol();
    let res = pr.w_assembler_redeem_stablecoin(
        BigInt(dollarToCent(amount)),
        addr,
        BigInt(txFee),
        BigInt(height),
        oracleBox,
        bankBox,
        implementor
    );
    res = JSON.parse(res);
    res.requests.splice(2, 1);
    res.inputs[1] = '$userIns';
    return res;
}

export async function redeemRcTx(amount) {
    await updateState();

    let age = await ageusd;
    let height = await currentHeight();
    let addr = getWalletAddress();
    let pr = new age.StableCoinProtocol();
    let res = pr.w_assembler_redeem_reservecoin(
        BigInt(Math.floor(amount)),
        addr,
        BigInt(txFee),
        BigInt(height),
        oracleBox,
        bankBox,
        implementor
    );
    res = JSON.parse(res);
    res.requests.splice(2, 1);
    res.inputs[1] = '$userIns';
    return res;
}

export async function maxRcToRedeem() {
    if (!bankBox || !oracleBox) await forceUpdateState();
    if (bankBox.current_reserve_ratio(oracleBox) <= 400n) return 0
    return Number(bankBox.num_able_to_redeem_reservecoin(oracleBox));
}

export async function maxScToMint() {
    if (!bankBox || !oracleBox) await forceUpdateState();
    if (bankBox.current_reserve_ratio(oracleBox) <= 400n) return 0
    return Number(bankBox.num_able_to_mint_stablecoin(oracleBox));
}

export async function maxRcToMint(height) {
    if (!bankBox || !oracleBox) await forceUpdateState();
    // if (bankBox.current_reserve_ratio(oracleBox) >= 800n) return 0
    return Number(bankBox.num_able_to_mint_reservecoin(oracleBox, BigInt(height)));
}

export async function ableRcToRedeem(amount) {
    if (!bankBox || !oracleBox) await forceUpdateState();
    console.log(amount, BigInt(bankBox.redeem_reservecoin_reserve_ratio(oracleBox, BigInt(amount))));
    return Number(bankBox.able_to_redeem_reservecoin_amount(oracleBox, BigInt(amount)));
}

export async function ableScToMint(amount) {
    if (!bankBox || !oracleBox) await forceUpdateState();
    return Number(bankBox.able_to_mint_stablecoin_amount(oracleBox, BigInt(amount)));
}

export async function ableRcToMint(height, amount) {
    if (!bankBox || !oracleBox) await forceUpdateState();
    return Number(bankBox.able_to_mint_reservecoin_amount(oracleBox, BigInt(amount), BigInt(height)));
}

export async function scPrice() {
    if (!bankBox || !oracleBox) await forceUpdateState();
    return Number(bankBox.stablecoin_nominal_price(oracleBox));
}

export function rcPrice() {
    if (!bankBox || !oracleBox) return NaN;
    return Number(bankBox.reservecoin_nominal_price(oracleBox));
}

export async function scNumCirc() {
    if (!bankBox || !oracleBox) await forceUpdateState();
    return Number(bankBox.num_circulating_stablecoins());
}

export async function rcNumCirc() {
    if (!bankBox || !oracleBox) await forceUpdateState();
    return Number(bankBox.num_circulating_reservecoins());
}

export async function scBalance(bal) {
    return bal[await scTokenId()] || 0;
}

export async function rcBalance(bal) {
    return bal[await rcTokenId()] || 0;
}

export async function ergBalance(bal) {
    return bal['erg'] || 0;
}

export function currentReserveRatio() {
    return Number(bankBox.current_reserve_ratio(oracleBox));
}

