import React, { Component } from 'react';
import cn from 'classnames';
import { toast } from 'react-toastify';
import Card from '../../../../components/Card/Card';
import Switch from '../../../../components/Switch/Switch';
import { ergCoin, usdAcronym, usdName } from '../../../../utils/consts';
import { amountFromRedeemingSc, feeFromRedeemingSc, scNumCirc } from '../../../../utils/ageHelper';
import { dollarToCent } from '../../../../utils/serializer';
import WalletModal from '../../../../components/WalletModal/WalletModal';
import { isWalletSaved } from '../../../../utils/helpers';
import { redeemSc } from '../../../../utils/redeemSc';
import InfoModal from '../../../../components/InfoModal/InfoModal';
import Loader from '../../../../components/Loader/Loader';

export class RedeemForm extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            redeemErgVal: 0,
            redeemErgFee: 0,
            isModalOpen: false,
            address: '',
            dueTime: null,
            errMsg: '',
            amount: '',
        };
    }

    async updateParams(amount: any) {
        if (!amount || !amount.trim()) {
            this.setState({
                redeemErgVal: 0,
                redeemErgFee: 0,
            });
        }
        const tot = await amountFromRedeemingSc(amount);
        const fee = await feeFromRedeemingSc(amount);
        this.setState({
            redeemErgFee: fee / 1e9,
            redeemErgVal: (tot + fee) / 1e9,
        });
    }

    async isInputInvalid(inp: any) {
        const maxAllowed = await scNumCirc();

        if (maxAllowed < inp) {
            this.setState({
                errMsg: `Unable to redeem more than ${(maxAllowed / 100).toFixed(
                    2,
                )} ${usdName} based on current circulating supply`,
            });
            return;
        }

        this.setState({
            errMsg: '',
        });
    }

    async inputChange(inp: string) {
        const parts = inp.split('.');
        if (inp.startsWith('-') || (parts.length > 1 && parts[1].length > 2)) return;

        this.setState({ amount: inp });

        await this.isInputInvalid(dollarToCent(inp));
        await this.updateParams(inp);
    }

    startScRedeem() {
        if (!isWalletSaved()) {
            toast.warn('Please set up your wallet first.');
            this.setState({ isWalletModalOpen: true });
            return;
        }
        this.setState({ loading: true });
        redeemSc(this.state.amount)
            .then((res) => {
                this.setState({
                    address: res.addr,
                    coin: usdName,
                    price: this.state.amount,
                    isModalOpen: true,
                    loading: false,
                    mintNanoErgVal: 0,
                    dueTime: res.dueTime,
                });
            })
            .catch((err) => {
                toast.error(`Could not register the request.${err.message}`);
                this.setState({ loading: false });
            });
    }

    render() {
        return (
            <Card title={`Redeem ${usdName}`}>
                <Switch rightSide={ergCoin} leftSide={usdAcronym} />
                <div className="delimiter" />
                <div className="input mt-xl-20 mb-xl-20 mt-15 mb-15 mt-lg-20 mb-lg-20">
                    <div className="input-group">
                        <input
                            value={this.state.amount}
                            onChange={(e) => {
                                this.inputChange(e.target.value);
                            }}
                            type="number"
                            placeholder="Amount (SigUSD)"
                        />
                    </div>
                    <span
                        className={cn('input__subtext', {
                            error: this.state.errMsg,
                        })}
                    >
                        {this.state.errMsg
                            ? this.state.errMsg
                            : 'A fee is charged for currency conversion'}
                    </span>
                </div>
                <div className="delimiter" />
                <div className="terms">
                    <p>
                        {this.state.amount} {usdName} ≈ {this.state.redeemErgVal.toFixed(3)} ERG
                    </p>
                    <p>Fee ≈ {this.state.redeemErgFee.toFixed(3)} ERG </p>
                    <p>
                        You will get ≈{' '}
                        {(this.state.redeemErgVal - this.state.redeemErgFee).toFixed(3)} ERG{' '}
                    </p>
                </div>
                <button
                    onClick={() => this.startScRedeem()}
                    disabled={this.state.loading || this.state.errMsg || !this.state.amount}
                    className="mt-sm-15 mt-xl-40 mt-lg-25 btn btn--white"
                >
                    {this.state.loading ? <Loader /> : 'Redeem'}
                </button>
                <InfoModal
                    coin={this.state.coin}
                    address={this.state.address}
                    value={this.state.price}
                    open={this.state.isModalOpen}
                    onClose={() => this.setState({ isModalOpen: false })}
                    dueTime={this.state.dueTime}
                />
                <WalletModal
                    onClose={() => this.setState({ isWalletModalOpen: false })}
                    open={this.state.isWalletModalOpen}
                />
            </Card>
        );
    }
}

export default RedeemForm;
