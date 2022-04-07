import React, { Component } from 'react';
import cn from 'classnames';
import { toast } from 'react-toastify';
import { generateUniqueId } from 'utils/utils';
import { Trans, withTranslation } from 'react-i18next';
import { WithT } from 'i18next';
import { WalletContext } from 'providers/WalletContext';
import Card from '../../../../components/Card/Card';
import Switch from '../../../../components/Switch/Switch';
import { ergCoin, reserveAcronym, reserveName, sigRsvTokenId } from '../../../../utils/consts';
import {
    amountFromRedeemingRc,
    feeFromRedeemingRc,
    maxRcToRedeem,
} from '../../../../utils/ageHelper';
import { isNatural } from '../../../../utils/serializer';
import WalletModal from '../../../../components/WalletModal/WalletModal';
import Loader from '../../../../components/Loader/Loader';
import { isDappWallet, isWalletSaved } from '../../../../utils/helpers';
import { redeemRc } from '../../../../utils/redeemRc';
import InfoModal from '../../../../components/InfoModal/InfoModal';
import { walletSendFunds } from '../../../../utils/walletUtils';

type RedeemFormProps = WithT;

class RedeemForm extends Component<RedeemFormProps, any> {
    // eslint-disable-next-line react/static-property-placement
    static contextType = WalletContext;

    constructor(props: RedeemFormProps) {
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
                const { t } = this.props;
                this.setState({
                    errMsg: t('errorCannotRedeemOverReserve', { maxAllowed, coin: reserveName }),
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
        const { t } = this.props;

        const { signTx, submitTx, getWalletUtxos: getUtxos, isAddressSet } = this.context;

        if (!isAddressSet) {
            toast.warn(t('warnSetWallet'));
            this.setState({ isWalletModalOpen: true });
            return;
        }
        this.setState({ loading: true });
        redeemRc(this.state.amount)
            .then((res) => {
                if (isDappWallet()) {
                    const need = {
                        ERG: 10000000,
                        [sigRsvTokenId]: this.state.amount,
                    };

                    walletSendFunds({
                        need,
                        addr: res.addr,
                        getUtxos,
                        signTx,
                        submitTx,
                    }).then((res) => {
                        this.setState({
                            loading: false,
                        });
                    });
                } else {
                    this.setState({
                        address: res.addr,
                        coin: reserveName,
                        price: this.state.amount,
                        isModalOpen: true,
                        loading: false,
                        mintNanoErgVal: 0,
                        dueTime: res.dueTime,
                    });
                }
            })
            .catch((err) => {
                let { message } = err;
                if (!message) message = err;
                toast.error(t('errorCannotRegisterRequest', { error: err.message }));
                this.setState({ loading: false });
            });
    }

    render() {
        const { t } = this.props;
        return (
            <Card title={`${t('redeem')} ${reserveName}`}>
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
                            placeholder={`${t('amount')} (${reserveAcronym})`}
                        />
                    </div>
                    <span
                        className={cn('input__subtext', {
                            error: this.state.errMsg,
                        })}
                    >
                        {this.state.errMsg ? this.state.errMsg : <Trans i18nKey="feeNote" />}
                    </span>
                </div>
                <div className="delimiter" />
                <div className="terms">
                    <p>
                        {this.state.amount} {reserveAcronym} ≈ {this.state.redeemErgVal.toFixed(3)}{' '}
                        ERG
                    </p>
                    <p>
                        <Trans i18nKey="fee" /> ≈ {this.state.redeemErgFee.toFixed(3)} ERG{' '}
                    </p>
                    <p>
                        <Trans i18nKey="youGet" /> ≈{' '}
                        {(this.state.redeemErgVal - this.state.redeemErgFee).toFixed(3)} ERG{' '}
                    </p>
                </div>
                <button
                    onClick={() => this.startRcRedeem()}
                    disabled={this.state.loading || this.state.errMsg || !this.state.amount}
                    className="mt-sm-15 mt-xl-40 mt-lg-25 btn btn--white"
                >
                    {this.state.loading ? <Loader /> : <Trans i18nKey="redeemButton" />}
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

export default withTranslation()(RedeemForm);
