import React, { Component } from 'react';
import cn from 'classnames';
import { toast } from 'react-toastify';
import { generateUniqueId } from 'utils/utils';
import Card from '../../../../components/Card/Card';
import Switch from '../../../../components/Switch/Switch';
import { ergCoin, reserveName, usdAcronym, usdName } from '../../../../utils/consts';
import { feeToMintSc, maxScToMint, priceToMintSc, scNumCirc } from '../../../../utils/ageHelper';
import { dollarToCent } from '../../../../utils/serializer';
import Loader from '../../../../components/Loader/Loader';
import { isDappWallet, isWalletSaved } from '../../../../utils/helpers';
import { mintSc } from '../../../../utils/mintSc';
import InfoModal from '../../../../components/InfoModal/InfoModal';
import WalletModal from '../../../../components/WalletModal/WalletModal';
import { Trans, withTranslation } from 'react-i18next';
import { WithT } from 'i18next';
import { walletSendFunds } from '../../../../utils/walletUtils';

type PurchaseFormProps = WithT;

class PurchaseForm extends Component<PurchaseFormProps, any> {
    constructor(props: PurchaseFormProps) {
        super(props);
        this.state = {
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
        if (!amount || !amount.trim()) {
            this.setState({
                mintErgVal: 0,
                mintErgFee: 0,
            });
            return;
        }
        Promise.all([priceToMintSc(amount), feeToMintSc(amount)]).then(([tot, fee]) => {
            if (this.state.requestId === requestId) {
                this.setState({
                    mintErgFee: fee / 1e9,
                    mintErgVal: (tot - fee) / 1e9,
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
                    errMsg: t('errorCannotMintOverReserve', { maxAllowed: (maxAllowed / 100).toFixed(2), name: usdName }),
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

    startScMint() {
        const { t } = this.props;
        if (!isWalletSaved()) {
            toast.warn(t('warnSetWallet'));
            this.setState({ isWalletModalOpen: true });
            return;
        }
        this.setState({ loading: true });
        mintSc(this.state.amount)
            .then((res) => {
                if (isDappWallet()) {
                    walletSendFunds({'ERG': res.price}, res.addr).then(res => {
                        this.setState({
                            loading: false,
                        });
                    })
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
                        {this.state.errMsg
                            ? this.state.errMsg
                            : <Trans i18nKey="feeNote"/>}
                    </span>
                </div>
                <div className="delimiter" />
                <div className="terms">
                    <p>
                        {this.state.amount} {usdName} ≈ {this.state.mintErgVal.toFixed(3)} ERG
                    </p>
                    <p><Trans i18nKey="fee"/> ≈ {this.state.mintErgFee.toFixed(3)} ERG </p>
                    <p>
                        <Trans i18nKey="youPay"/> ≈ {(this.state.mintErgVal + this.state.mintErgFee).toFixed(3)}{' '}
                        ERG{' '}
                    </p>
                </div>
                <button
                    className="mt-sm-15 mt-xl-40 mt-lg-25 btn btn--white"
                    onClick={() => this.startScMint()}
                    disabled={this.state.loading || this.state.errMsg || !this.state.amount}
                >
                    {this.state.loading ? <Loader /> : <Trans i18nKey="purchaseButton"/>}
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

export default withTranslation()(PurchaseForm);
