import React, { Component } from 'react';
import cn from 'classnames';
import { toast } from 'react-toastify';
import { generateUniqueId } from 'utils/utils';
import { Trans, withTranslation } from 'react-i18next';
import { WithT } from 'i18next';
import { WalletContext } from 'providers/WalletContext';
import Card from '../../../../components/Card/Card';
import Switch from '../../../../components/Switch/Switch';
import { ergCoin, sigUsdTokenId, usdAcronym, usdName } from '../../../../utils/consts';
import { amountFromRedeemingSc, feeFromRedeemingSc, scNumCirc } from '../../../../utils/ageHelper';
import { dollarToCent } from '../../../../utils/serializer';
import WalletModal from '../../../../components/WalletModal/WalletModal';
import { isDappWallet, isWalletSaved } from '../../../../utils/helpers';
import { redeemSc } from '../../../../utils/redeemSc';
import InfoModal from '../../../../components/InfoModal/InfoModal';
import Loader from '../../../../components/Loader/Loader';
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
            isModalOpen: false,
            address: '',
            dueTime: null,
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
        }

        Promise.all([amountFromRedeemingSc(amount), feeFromRedeemingSc(amount)]).then(
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
        scNumCirc().then((maxAllowed) => {
            if (this.state.requestId !== requestId) {
                return;
            }

            if (maxAllowed < inp) {
                const { t } = this.props;
                this.setState({
                    errMsg: t('errorRedeemOverMax', {
                        amount: (maxAllowed / 100).toFixed(2),
                        coin: usdName,
                    }),
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
        const parts = inp.split('.');
        if (inp.startsWith('-') || (parts.length > 1 && parts[1].length > 2)) return;

        const timerId = setTimeout(() => {
            const requestId = generateUniqueId();
            this.setState({ requestId });
            this.isInputInvalid(dollarToCent(inp), requestId);
            this.updateParams(inp, requestId);
        }, 200);

        this.setState({ amount: inp, inputChangeTimerId: timerId });
    }

    startScRedeem() {
        const { t } = this.props;
        if (!isWalletSaved()) {
            toast.warn(t('warnSetWallet'));
            this.setState({ isWalletModalOpen: true });
            return;
        }
        this.setState({ loading: true });
        redeemSc(this.state.amount)
            .then((res) => {
                if (isDappWallet()) {
                    const need = {
                        ERG: 10000000,
                        [sigUsdTokenId]: dollarToCent(this.state.amount),
                    };
                    const { signTx, submitTx, getWalletUtxos: getUtxos } = this.context;

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
                        coin: usdName,
                        price: this.state.amount,
                        isModalOpen: true,
                        loading: false,
                        mintNanoErgVal: 0,
                        dueTime: res.dueTime,
                    });
                }
            })
            .catch((err) => {
                toast.error(t('errorCannotRegisterRequest', { error: err.message }));
                this.setState({ loading: false });
            });
    }

    render() {
        const { t } = this.props;
        return (
            <Card title={`${t('redeem')} ${usdName}`}>
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
                            placeholder={`${t('amount')} (${usdAcronym})`}
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
                        {this.state.amount} {usdName} ≈ {this.state.redeemErgVal.toFixed(3)} ERG
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
                    onClick={() => this.startScRedeem()}
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
