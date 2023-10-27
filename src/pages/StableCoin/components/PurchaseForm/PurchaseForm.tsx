import React, { Component } from 'react';
import cn from 'classnames';
import { toast } from 'react-toastify';
import { generateUniqueId } from 'utils/utils';
import { Trans, withTranslation } from 'react-i18next';
import { WithT } from 'i18next';
import { WalletContext } from 'providers/WalletContext';
import ErgoPayButton from 'components/ErgoPayButton/ErgoPayButton';
import Card from '../../../../components/Card/Card';
import Switch from '../../../../components/Switch/Switch';
import { ergCoin, reserveName, usdAcronym, usdName } from '../../../../utils/consts';
import { feeToMintSc, maxScToMint, priceToMintSc, scNumCirc } from '../../../../utils/ageHelper';
import { dollarToCent } from '../../../../utils/serializer';
import Loader from '../../../../components/Loader/Loader';
import { isDappWallet, isErgoPay, isWalletSaved } from '../../../../utils/helpers';
import { mintSc } from '../../../../utils/mintSc';
import InfoModal from '../../../../components/InfoModal/InfoModal';
import WalletModal from '../../../../components/WalletModal/WalletModal';
import { walletSendFunds } from '../../../../utils/walletUtils';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { setTxFee, txFee } from 'utils/assembler';

type PurchaseFormProps = WithT;

class PurchaseForm extends Component<PurchaseFormProps, any> {
    // eslint-disable-next-line react/static-property-placement
    static contextType = WalletContext;

    constructor(props: PurchaseFormProps) {
        super(props);
        this.state = {
            txFeeVal: txFee/1e9,
            mintErgVal: 0,
            mintErgFee: 0,
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
        this.setState({ loading: true });

        if (!amount || !amount.trim()) {
            this.setState({
                mintErgVal: 0,
                mintErgFee: 0,
                loading: false,
            });

            return;
        }
        Promise.all([priceToMintSc(amount), feeToMintSc(amount)]).then(([tot, fee]) => {
            if (this.state.requestId === requestId) {
                this.setState({
                    mintErgFee: fee / 1e9,
                    mintErgVal: (tot - fee) / 1e9,
                    loading: false,
                });
            }
        });
    }

    isInputInvalid(inp: any, requestId: string) {
        maxScToMint().then((maxAllowed) => {
            const { t } = this.props;
            if (this.state.requestId !== requestId) {
                return;
            }

            if (maxAllowed < inp) {
                this.setState({
                    errMsg: t('errorCannotMintOverReserve', {
                        maxAllowed: (maxAllowed / 100).toFixed(2),
                        name: usdName,
                    }),
                });
                return;
            }

            this.setState({
                errMsg: '',
            });
        });
    }

    async inputChange(inp: string) {
        clearTimeout(this.state.inputChangeTimerId);
        const fee = this.state.txFeeVal * 1e9
        setTxFee(Math.round(fee))
        const parts = inp.split('.');
        if (inp.startsWith('-') || (parts.length > 1 && parts[1].length > 2)) return;

        const timerId = setTimeout(() => {
            const requestId = generateUniqueId();
            this.setState({ requestId });
            this.isInputInvalid(dollarToCent(inp), requestId);
            this.updateParams(inp, requestId);
        }, 200);

        this.setState({ amount: inp, inputChangeTimerId: timerId, loading: true });
    }

    startScMint() {
        const { t } = this.props;
        const { signTx, submitTx, getWalletUtxos: getUtxos, isAddressSet } = this.context;

        if (!isAddressSet) {
            toast.warn(t('warnSetWallet'));
            this.setState({ isWalletModalOpen: true });
            return;
        }
        this.setState({ loading: true });
        if (isDappWallet()) {
            mintSc(this.state.amount, this.context, false, isErgoPay()).then((res) => {
                this.setState({
                    loading: false,
                })
            }).catch((err) => {
                toast.error(t('errorCannotRegisterRequest', { error: err.message }));
                this.setState({ loading: false });
            });
        } else {
            mintSc(this.state.amount, this.context)
                .then((res) => {
                    if (isDappWallet()) {
                        walletSendFunds({
                            need: { ERG: res.price },
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
                            coin: 'ERG',
                            price: res.price / 1e9,
                            isModalOpen: true,
                            loading: false,
                            // mintNanoErgVal: 0,
                            dueTime: res.dueTime,
                        });
                    }
                })
                .catch((err) => {
                    toast.error(t('errorCannotRegisterRequest', { error: err.message }));
                    this.setState({ loading: false });
                });
            }
    }

    render() {
        const { t } = this.props;
        return (
            <Card title={`${t('purchase')} ${usdName}`}>
                <Switch leftSide={ergCoin} rightSide={usdAcronym} />
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
                    <Slider min={0.001}
                    max={1.0}
                    defaultValue={this.state.txFeeVal}
                    onChange={(e) => {
                        this.setState({txFeeVal: e})
                        this.inputChange(this.state.amount)
                    }}
                    step={0.01}/>

                    <p>Miner fee = {this.state.txFeeVal} ERG</p>
                    <p>
                        {this.state.amount} {usdName} ≈ {this.state.mintErgVal.toFixed(3)} ERG
                    </p>
                    <p>
                        <Trans i18nKey="fee" /> ≈ {this.state.mintErgFee.toFixed(3)} ERG{' '}
                    </p>
                    <p>
                        <Trans i18nKey="youPay" /> ≈{' '}
                        {(this.state.mintErgVal + this.state.mintErgFee).toFixed(3)} ERG{' '}
                    </p>
                </div>
                <div className="btn-group">
                    <button
                        className="mt-sm-15 mt-xl-40 mt-lg-25 btn btn--white"
                        onClick={() => this.startScMint()}
                        disabled={this.state.loading || this.state.errMsg || !this.state.amount}
                    >
                        {this.state.loading ? <Loader /> : <Trans i18nKey="purchaseButton" />}
                    </button>
                </div>
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

export default withTranslation()(PurchaseForm);
