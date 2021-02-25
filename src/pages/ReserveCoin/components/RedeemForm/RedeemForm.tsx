import React, { Component } from 'react';
import cn from 'classnames';
import { toast } from 'react-toastify';
import { generateUniqueId } from 'utils/utils';
import Card from '../../../../components/Card/Card';
import Switch from '../../../../components/Switch/Switch';
import { ergCoin, reserveAcronym, reserveName } from '../../../../utils/consts';
import {
    amountFromRedeemingRc,
    feeFromRedeemingRc,
    maxRcToRedeem,
} from '../../../../utils/ageHelper';
import { isNatural } from '../../../../utils/serializer';
import WalletModal from '../../../../components/WalletModal/WalletModal';
import Loader from '../../../../components/Loader/Loader';
import { isWalletSaved } from '../../../../utils/helpers';
import { redeemRc } from '../../../../utils/redeemRc';
import InfoModal from '../../../../components/InfoModal/InfoModal';

export class RedeemForm extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            redeemErgVal: 0,
            redeemErgFee: 0,
            dueTime: null,
            isModalOpen: false,
            address: '',
            errMsg: '',
            amount: '',
            inputChangeTimerId: null,
            requestId: null,
        };
    }

    componentWillUnmount() {
        clearTimeout(this.state.inputChangeTimerId);
    }

    updateParams(amount: any, requestId: string) {
        if (!amount || !amount.trim()) {
            this.setState({
                redeemErgVal: 0,
                redeemErgFee: 0,
            });
            return;
        }
        Promise.all([amountFromRedeemingRc(amount), feeFromRedeemingRc(amount)]).then(
            ([tot, fee]) => {
                if (this.state.requestId === requestId) {
                    this.setState({
                        redeemErgFee: fee / 1e9,
                        redeemErgVal: (tot + fee) / 1e9,
                    });
                }
            },
        );
    }

    isInputInvalid(inp: any, requestId: string) {
        maxRcToRedeem().then((maxAllowed) => {
            if (this.state.requestId !== requestId) {
                return;
            }

            if (maxAllowed < inp) {
                this.setState({
                    errMsg: `Unable to redeem more than ${maxAllowed} ${reserveName} based on the current reserve status`,
                });
                return;
            }

            this.setState({
                errMsg: '',
            });
        });
    }

    inputChange(inp: string) {
        clearTimeout(this.state.inputChangeTimerId);

        if (!isNatural(inp) || inp.startsWith('-')) return;

        const timerId = setTimeout(() => {
            const requestId = generateUniqueId();
            this.setState({ requestId });
            this.isInputInvalid(parseInt(inp), requestId);
            this.updateParams(inp, requestId);
        }, 200);

        this.setState({ amount: inp, inputChangeTimerId: timerId });
    }

    startRcRedeem() {
        if (!isWalletSaved()) {
            toast.warn('Please set up your wallet first.');
            this.setState({ isWalletModalOpen: true });
            return;
        }
        this.setState({ loading: true });
        redeemRc(this.state.amount)
            .then((res) => {
                this.setState({
                    address: res.addr,
                    coin: reserveName,
                    price: this.state.amount,
                    isModalOpen: true,
                    loading: false,
                    mintNanoErgVal: 0,
                    dueTime: res.dueTime,
                });
            })
            .catch((err) => {
                let { message } = err;
                if (!message) message = err;
                toast.error(`Could not register the request.\n${message}`);
                this.setState({ loading: false });
            });
    }

    render() {
        return (
            <Card title={`Redeem ${reserveName}`}>
                <Switch rightSide={ergCoin} leftSide={reserveAcronym} />
                <div className="delimiter" />
                <div className="input mt-xl-20 mb-xl-20 mt-15 mb-15 mt-lg-20 mb-lg-20">
                    <div className="input-group">
                        <input
                            value={this.state.amount}
                            step="1"
                            onChange={(e) => {
                                this.inputChange(e.target.value);
                            }}
                            type="number"
                            placeholder="Amount (SigRSV)"
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
                        {this.state.amount} {reserveAcronym} ≈ {this.state.redeemErgVal.toFixed(3)}{' '}
                        ERG
                    </p>
                    <p>Fee ≈ {this.state.redeemErgFee.toFixed(3)} ERG </p>
                    <p>
                        You will get ≈{' '}
                        {(this.state.redeemErgVal - this.state.redeemErgFee).toFixed(3)} ERG{' '}
                    </p>
                </div>
                <button
                    onClick={() => this.startRcRedeem()}
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
