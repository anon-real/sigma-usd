/* global BigInt */
import { dollarToCent, encodeNum, decodeNum } from './serializer';
import { implementor, MIN_RESERVE_RATIO, MAX_RESERVE_RATIO, FEE_PERCENT, IMPLEMENTOR_FEE_PERCENT, MIN_BOX_VALUE } from './consts';
import JSONBigInt from 'json-bigint';

export const JSON = JSONBigInt({ useNativeBigInt: true });
let ergolib = import('ergo-lib-wasm-browser')

export class BankService {
    constructor(bank, oracle) {
        this.bank = bank;
        this.oracle = oracle;
    }

    // Get nominal price of SigUSD from oracle
    async getSigNominal() {
        return Math.floor((await decodeNum(this.oracle.additionalRegisters.R4)) / 100);
    }

    // Get circulating SigUSD amount
    async getCircSig(bank = this.bank) {
        return BigInt(await decodeNum(bank.additionalRegisters.R4));
    }

    // Get circulating SigRSV amount
    async getCircRsv() {
        return BigInt(await decodeNum(this.bank.additionalRegisters.R5));
    }

    // Calculate total liabilities (in nanoERG)
    async getLiability() {
        const circSig = await this.getCircSig();
        const sigNominal = BigInt(await this.getSigNominal());
        if (circSig * sigNominal < BigInt(this.bank.value)) {
            return circSig * sigNominal;
        }

        return BigInt(this.bank.value);
    }

    // Calculate equity (reserves - liabilities)
    async getEquity() {
        return BigInt(this.bank.value) - await this.getLiability();
    }

    // Calculate nominal price of SigRSV
    async getRsvNominal() {
        const circRsv = await this.getCircRsv();
        if (circRsv <= BigInt(1)) return MIN_BOX_VALUE;
        return (await this.getEquity()) / circRsv;
    }

    // Calculate current reserve ratio
    async getReserveRatio() {
        const circSig = await this.getCircSig();
        if (circSig === BigInt(0)) return Number.MAX_SAFE_INTEGER;
        const perSig = Number((BigInt(this.bank.value) * BigInt(100)) / circSig);
        return Math.floor(perSig / await this.getSigNominal());
    }

    // Calculate price to mint SigUSD including fees
    async getSigPrice(amount, uifee = 0) {
        const sigNominal = await this.getSigNominal();
        const price = sigNominal * amount;
        return price + Math.floor(Math.abs(price) * (Number(FEE_PERCENT) + uifee) / 100);
    }

    // Calculate price to mint SigRSV including fees
    async getRsvPrice(amount, uifee = 0) {
        const price = Number(await this.getRsvNominal() * BigInt(amount));
        return price + Math.floor(Math.abs(price) * Number(FEE_PERCENT) / 100);
    }

    // Calculate total cost to mint SigUSD including all fees
    async totalCostToMintStablecoin(amount, txFee) {
        const baseCost = await this.getSigPrice(amount);
        const implementorFee = Math.floor(baseCost * IMPLEMENTOR_FEE_PERCENT);
        return baseCost + txFee + Number(MIN_BOX_VALUE * BigInt(2)) + implementorFee;
    }

    // Calculate total cost to mint SigRSV including all fees
    async totalCostToMintReservecoin(amount, txFee) {
        const baseCost = await this.getRsvPrice(amount);
        const implementorFee = Math.floor(baseCost * IMPLEMENTOR_FEE_PERCENT);
        return baseCost + txFee + Number(MIN_BOX_VALUE * BigInt(2)) + implementorFee;
    }

    // Calculate amount received from redeeming SigUSD
    async amountFromRedeemingStablecoin(amount, txFee) {
        const baseAmount = await this.getSigPrice(amount);
        const implementorFee = Math.floor(baseAmount * IMPLEMENTOR_FEE_PERCENT);
        const fees = txFee + implementorFee;
        return baseAmount > fees ? baseAmount - fees : 0;
    }

    // Calculate amount received from redeeming SigRSV
    async amountFromRedeemingReservecoin(amount, txFee) {
        const baseAmount = await this.getRsvPrice(amount);
        const implementorFee = Math.floor(baseAmount * IMPLEMENTOR_FEE_PERCENT);
        const fees = txFee + implementorFee;
        return baseAmount > fees ? baseAmount - fees : 0;
    }

    // Check if SigUSD can be minted
    async ableToMintStablecoin(amount) {
        const newReserveRatio = await this.mintStablecoinReserveRatio(amount);
        return newReserveRatio >= Number(MIN_RESERVE_RATIO);
    }

    // Check if SigRSV can be minted
    async ableToMintReservecoin(amount) {
        const newReserveRatio = await this.mintReservecoinReserveRatio(amount);
        return newReserveRatio <= Number(MAX_RESERVE_RATIO);
    }

    // Calculate new reserve ratio after minting SigUSD
    async mintStablecoinReserveRatio(amount) {
        const newBaseReserves = BigInt(this.bank.value) + BigInt(await this.getSigPrice(amount));
        const newCircSig = await this.getCircSig() + BigInt(amount);
        if (newCircSig === BigInt(0)) return Number.MAX_SAFE_INTEGER;
        const perSig = Number((newBaseReserves * BigInt(100)) / newCircSig);
        return Math.floor(perSig / await this.getSigNominal());
    }

    // Calculate new reserve ratio after minting SigRSV
    async mintReservecoinReserveRatio(amount) {
        const newBaseReserves = BigInt(this.bank.value) + BigInt(await this.getRsvPrice(amount));
        const circSig = await this.getCircSig();
        if (circSig === BigInt(0)) return Number.MAX_SAFE_INTEGER;
        const perSig = Number((newBaseReserves * BigInt(100)) / circSig);
        return Math.floor(perSig / await this.getSigNominal());
    }

    // Create transaction for minting SigUSD
    async mintStablecoinTx(amount, address, height, txFee) {
        const amountInCents = dollarToCent(amount);
        if (amountInCents === 0) return null;
        if (!this.ableToMintStablecoin(amountInCents)) return null;

        const totalCost = await this.totalCostToMintStablecoin(amountInCents, txFee);
        const implementorFee = Math.floor(await this.getSigPrice(amountInCents) * IMPLEMENTOR_FEE_PERCENT);

        // Create output bank box candidate
        const newBank = await this.deltaBank(amountInCents, 0);

        // Create implementor fee box
        const i64 = (await ergolib).I64.from_str(implementorFee.toString())
        const boxValue = (await ergolib).BoxValue.from_i64(i64)
        const addr = (await ergolib).Address.from_base58(implementor)
        const contract = (await ergolib).Contract.pay_to_address(addr)
        const implementorBox = new (await ergolib).ErgoBoxCandidateBuilder(
            boxValue,
            contract,
            height
        ).build();

        return {
            inputs: ['$bankBox', '$userIns'],
            dataInputs: ['$oracleBox'],
            outputs: [newBank, implementorBox],
            fee: txFee
        };
    }

    // Create transaction for minting SigRSV
    async mintReservecoinTx(amount, address, height, txFee) {
        if (amount === 0) return null;
        if (!this.ableToMintReservecoin(amount)) return null;

        const totalCost = await this.totalCostToMintReservecoin(amount, txFee);
        const implementorFee = Math.floor(await this.getRsvPrice(amount) * IMPLEMENTOR_FEE_PERCENT);

        // Create output bank box candidate
        const newBank = await this.deltaBank(0, amount);

        // Create implementor fee box
        const i64 = (await ergolib).I64.from_str(implementorFee.toString())
        const boxValue = (await ergolib).BoxValue.from_i64(i64)
        const addr = (await ergolib).Address.from_base58(implementor) 
        const contract = (await ergolib).Contract.pay_to_address(addr)
        const implementorBox = new (await ergolib).ErgoBoxCandidateBuilder(
            boxValue,
            contract,
            height
        ).build();

        return {
            inputs: ['$bankBox', '$userIns'],
            dataInputs: ['$oracleBox'],
            outputs: [newBank, implementorBox],
            fee: txFee
        };
    }

    // Helper method to create new bank state
    async deltaBank(sigAmount, rsvAmount) {
        const newBank = JSON.parse(JSON.stringify(this.bank));
        const sigPrice = await this.getSigPrice(sigAmount);
        const rsvPrice = await this.getRsvPrice(rsvAmount);

        newBank.additionalRegisters.R4 = await encodeNum(Number(await this.getCircSig()) + sigAmount);
        newBank.additionalRegisters.R5 = await encodeNum(Number(await this.getCircRsv()) + rsvAmount);

        if (newBank.assets[0]) {
            newBank.assets[0].amount -= sigAmount;
        }
        if (newBank.assets[1]) {
            newBank.assets[1].amount -= rsvAmount;
        }
        newBank.value = Number(BigInt(this.bank.value) + BigInt(sigPrice + rsvPrice));

        return newBank;
    }

    // Create transaction for redeeming SigUSD
    async redeemStablecoinTx(amount, address, height, txFee) {
        const amountInCents = dollarToCent(amount);
        if (amountInCents === 0) return null;

        const total = await this.amountFromRedeemingStablecoin(amountInCents, txFee);
        const implementorFee = Math.floor(await this.getSigPrice(amountInCents) * IMPLEMENTOR_FEE_PERCENT);

        // Create output bank box candidate
        const newBank = await this.deltaBank(-amountInCents, 0);

        // Create implementor fee box
        const i64 = (await ergolib).I64.from_str(implementorFee.toString())
        const boxValue = (await ergolib).BoxValue.from_i64(i64)
        const addr = (await ergolib).Address.from_base58(implementor)
        const contract = (await ergolib).Contract.pay_to_address(addr)
        const implementorBox = new (await ergolib).ErgoBoxCandidateBuilder(
            boxValue,
            contract,
            height
        ).build();

        return {
            inputs: ['$bankBox', '$userIns'],
            dataInputs: ['$oracleBox'],
            outputs: [newBank, implementorBox],
            fee: txFee
        };
    }

    // Create transaction for redeeming SigRSV
    async redeemReservecoinTx(amount, address, height, txFee) {
        if (amount === 0) return null;

        const total = await this.amountFromRedeemingReservecoin(amount, txFee);
        const implementorFee = Math.floor(await this.getRsvPrice(amount) * IMPLEMENTOR_FEE_PERCENT);

        // Create output bank box candidate
        const newBank = await this.deltaBank(0, -amount);

        // Create implementor fee box
        const i64 = (await ergolib).I64.from_str(implementorFee.toString())
        const boxValue = (await ergolib).BoxValue.from_i64(i64)
        const addr = (await ergolib).Address.from_base58(implementor)
        const contract = (await ergolib).Contract.pay_to_address(addr)
        const implementorBox = new (await ergolib).ErgoBoxCandidateBuilder(
            boxValue,
            contract,
            height
        ).build();

        return {
            inputs: ['$bankBox', '$userIns'],
            dataInputs: ['$oracleBox'],
            outputs: [newBank, implementorBox],
            fee: txFee
        };
    }
}