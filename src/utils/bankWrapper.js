import { BankService } from './bankService';
import { sigUsdTokenId, sigRsvTokenId, bankAddress, implementor, bankNftId } from './consts';
import { dollarToCent } from './serializer';

export class StableCoinProtocol {
    constructor() {
        this.bankService = null;
    }

    get stablecoin_token_id() {
        return sigUsdTokenId;
    }

    get reservecoin_token_id() {
        return sigRsvTokenId;
    }

    get bank_nft_id() {
        return bankNftId;
    }

    w_assembler_mint_stablecoin(amount, addr, txFee, height, oracleBox, bankBox, price, implementorAddr = implementor) {
        this.bankService = new BankService(bankBox, oracleBox);
        const amountInDollars = Number(amount) / 100; // Convert cents to dollars
        const tx = this.bankService.mintStablecoinTx(amountInDollars, addr, Number(height), Number(txFee));
        
        // Format tx to match WASM output
        return JSON.stringify({
            inputs: tx.inputs,
            dataInputs: tx.dataInputs,
            requests: [
                tx.outputs[0], // bank output
                { value: tx.outputs[1].value + tx.fee }, // combined user output and fee
                tx.outputs[1] // implementor fee output
            ]
        });
    }

    w_assembler_mint_reservecoin(amount, addr, txFee, height, oracleBox, bankBox, price, implementorAddr = implementor) {
        this.bankService = new BankService(bankBox, oracleBox);
        const tx = this.bankService.mintReservecoinTx(Number(amount), addr, Number(height), Number(txFee));
        
        // Format tx to match WASM output
        return JSON.stringify({
            inputs: tx.inputs,
            dataInputs: tx.dataInputs,
            requests: [
                tx.outputs[0], // bank output
                { value: tx.outputs[1].value + tx.fee }, // combined user output and fee
                tx.outputs[1] // implementor fee output
            ]
        });
    }
}

export class BankBox {
    constructor(bankBox, oracleBox) {
        this.bankService = new BankService(bankBox, oracleBox);
    }

    static w_explorer_endpoint(explorerEndpoint) {
        return `${explorerEndpoint}/api/v1/boxes/unspent/byTokenId/${bankAddress}`;
    }

    static w_process_explorer_response(response) {
        return JSON.parse(response).items;
    }

    stablecoin_nominal_price(oracleBox) {
        return BigInt(this.bankService.getSigNominal());
    }

    reservecoin_nominal_price(oracleBox) {
        return this.bankService.getRsvNominal();
    }

    num_circulating_stablecoins() {
        return this.bankService.getCircSig();
    }

    num_circulating_reservecoins() {
        return this.bankService.getCircRsv();
    }

    current_reserve_ratio(oracleBox) {
        return BigInt(this.bankService.getReserveRatio());
    }

    base_reserves() {
        return Number(this.bankService.getEquity());
    }

    total_cost_to_mint_stablecoin(amount, oracleBox, txFee) {
        return BigInt(this.bankService.totalCostToMintStablecoin(Number(amount), Number(txFee)));
    }

    total_cost_to_mint_reservecoin(amount, oracleBox, txFee) {
        return BigInt(this.bankService.totalCostToMintReservecoin(Number(amount), Number(txFee)));
    }

    total_amount_from_redeeming_stablecoin(amount, oracleBox, txFee) {
        return BigInt(this.bankService.amountFromRedeemingStablecoin(Number(amount), Number(txFee)));
    }

    total_amount_from_redeeming_reservecoin(amount, oracleBox, txFee) {
        return BigInt(this.bankService.amountFromRedeemingReservecoin(Number(amount), Number(txFee)));
    }

    fees_from_minting_stablecoin(amount, oracleBox, txFee) {
        const total = this.bankService.totalCostToMintStablecoin(Number(amount), Number(txFee));
        const base = this.bankService.getSigPrice(Number(amount));
        return BigInt(total - base);
    }

    fees_from_minting_reservecoin(amount, oracleBox, txFee) {
        const total = this.bankService.totalCostToMintReservecoin(Number(amount), Number(txFee));
        const base = this.bankService.getRsvPrice(Number(amount));
        return BigInt(total - base);
    }

    fees_from_redeeming_stablecoin(amount, oracleBox, txFee) {
        const total = this.bankService.amountFromRedeemingStablecoin(Number(amount), Number(txFee));
        const base = this.bankService.getSigPrice(Number(amount));
        return BigInt(base - total);
    }

    fees_from_redeeming_reservecoin(amount, oracleBox, txFee) {
        const total = this.bankService.amountFromRedeemingReservecoin(Number(amount), Number(txFee));
        const base = this.bankService.getRsvPrice(Number(amount));
        return BigInt(base - total);
    }

    able_to_mint_stablecoin_amount(oracleBox, amount) {
        return this.bankService.ableToMintStablecoin(Number(amount));
    }

    able_to_mint_reservecoin_amount(oracleBox, amount) {
        return this.bankService.ableToMintReservecoin(Number(amount));
    }

    able_to_redeem_reservecoin_amount(oracleBox, amount) {
        const equity = this.bankService.getEquity();
        const rsvNominal = this.bankService.getRsvNominal();
        return Number(equity) >= Number(rsvNominal) * Number(amount);
    }

    num_able_to_redeem_reservecoin(oracleBox) {
        const equity = this.bankService.getEquity();
        const rsvNominal = this.bankService.getRsvNominal();
        return equity / rsvNominal;
    }

    num_able_to_mint_stablecoin(oracleBox) {
        const equity = this.bankService.getEquity();
        const sigNominal = BigInt(this.bankService.getSigNominal());
        return Number(equity / sigNominal);
    }
}

export class ErgUsdOraclePoolBox {
    static w_explorer_endpoint(explorerEndpoint) {
        return `${explorerEndpoint}/api/v1/boxes/unspent/byErgoTree/${encodeURIComponent(process.env.ORACLE_POOL_NFT_TREE)}`;
    }

    static w_process_explorer_response(response) {
        return JSON.parse(response).items;
    }
} 