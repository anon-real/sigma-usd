import React, { Component } from 'react';
import cn from 'classnames';
import { toast } from 'react-toastify';
import Card from '../../../../components/Card/Card';
import Switch from '../../../../components/Switch/Switch';
import { ergCoin, reserveName, usdAcronym, usdName } from '../../../../utils/consts';
import { feeToMintSc, maxScToMint, priceToMintSc, scNumCirc } from '../../../../utils/ageHelper';
import { dollarToCent } from '../../../../utils/serializer';
import Loader from '../../../../components/Loader/Loader';
import { isWalletSaved } from '../../../../utils/helpers';
import { mintSc } from '../../../../utils/mintSc';
import InfoModal from '../../../../components/InfoModal/InfoModal';
import WalletModal from '../../../../components/WalletModal/WalletModal';

export class PurchaseForm extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            mintErgVal: 0,
            mintErgFee: 0,
            isModalOpen: false,
            address: '',
            dueTime: null,
        };
    }

    async updateParams(amount: any) {
        const tot = await priceToMintSc(amount);
        const fee = await feeToMintSc(amount);
        this.setState({
            mintErgFee: fee / 1e9,
            mintErgVal: (tot - fee) / 1e9,
        });
    }

    async isInputInvalid(inp: number) {
        const maxAllowed = await maxScToMint();
        if (maxAllowed < inp)
            return `Can not mint more than ${(maxAllowed / 100).toFixed(
                2,
            )} ${usdName} based on current reserve status`;
        return '';
    }

    async inputChange(inp: string) {
        const parts = inp.split('.');
        if (inp.startsWith('-') || (parts.length > 1 && parts[1].length > 2)) return;

        const errMsg = await this.isInputInvalid(dollarToCent(inp));
        this.setState({ amount: inp, errMsg });

        if (!inp || !inp.trim())
            this.setState({
                mintErgVal: 0,
                mintErgFee: 0,
            });
        else await this.updateParams(inp);
    }

    startScMint() {
        if (!isWalletSaved()) {
            toast.warn('Please set up your wallet first.');
            this.setState({ isWalletModalOpen: true });
            return;
        }
        this.setState({ loading: true });
        mintSc(this.state.amount)
            .then((res) => {
                this.setState({
                    address: res.addr,
                    coin: 'ERG',
                    price: res.price / 1e9,
                    isModalOpen: true,
                    loading: false,
                    // mintNanoErgVal: 0,
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
            <Card title={`Purchase ${usdName}`}>
                <Switch leftSide={ergCoin} rightSide={usdAcronym} />
                <div className="delimiter" />
                <div className="input mt-xl-20 mb-xl-20 mt-15 mb-15 mt-lg-20 mb-lg-20">
                    <div className="input-group">
                        <input
                            value={this.state.amount}
                            onChange={(e) => {
                                this.inputChange(e.target.value).catch((err) =>
                                    console.log('err when changing reserve amount', err),
                                );
                            }}
                            type="number"
                            placeholder="Amount"
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
                        {this.state.amount} {usdName} ≈ {this.state.mintErgVal.toFixed(3)} ERG
                    </p>
                    <p>Fee ≈ {this.state.mintErgFee.toFixed(3)} ERG </p>
                    <p>
                        You will pay ≈ {(this.state.mintErgVal + this.state.mintErgFee).toFixed(3)}{' '}
                        ERG{' '}
                    </p>
                </div>
                <button
                    className="mt-sm-15 mt-xl-40 mt-lg-25 btn btn--white"
                    onClick={() => this.startScMint()}
                    disabled={this.state.loading || this.state.errMsg || !this.state.amount}
                >
                    {this.state.loading ? <Loader /> : 'Purchase'}
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

export default PurchaseForm;
