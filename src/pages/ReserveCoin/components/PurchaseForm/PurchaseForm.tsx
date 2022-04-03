import React, { Component } from 'react';
import cn from 'classnames';
import InfoModal from 'components/InfoModal/InfoModal';
import WalletModal from 'components/WalletModal/WalletModal';
import { toast } from 'react-toastify';
import { generateUniqueId } from 'utils/utils';
import { Trans, withTranslation } from 'react-i18next';
import { WithT } from 'i18next';
import Card from '../../../../components/Card/Card';
import Switch from '../../../../components/Switch/Switch';
import { ergCoin, reserveAcronym, reserveName } from '../../../../utils/consts';
import { feeToMintRc, maxRcToMint, priceToMintRc } from '../../../../utils/ageHelper';
import { isNatural } from '../../../../utils/serializer';
import Loader from '../../../../components/Loader/Loader';
import { isDappWallet, isWalletSaved } from '../../../../utils/helpers';
import { mintRc } from '../../../../utils/mintRc';
import { currentHeight } from '../../../../utils/explorer';
import { walletSendFunds } from '../../../../utils/walletUtils';

type PurchaseFormProps = WithT;

class PurchaseForm extends Component<PurchaseFormProps, any> {
    constructor(props: PurchaseFormProps) {
        super(props);
        this.state = {
            mintErgVal: 0,
            mintErgFee: 0,
            loading: false,
            address: '',
            dueTime: null,
            curHeight: NaN,
            errMsg: '',
            amount: '',
            inputChangeTimerId: null,
            requestId: null,
        };
    }

    componentDidMount() {
        currentHeight().then((height) => this.setState({ curHeight: height }));
    }

    componentWillUnmount() {
        clearTimeout(this.state.inputChangeTimerId);
    }

    isInputInvalid(inp: number, requestId: string) {
        if (!this.state.curHeight) {
            this.setState({
                errMsg: '',
            });
            return;
        }

        maxRcToMint(this.state.curHeight).then((maxAllowed) => {
            const { t } = this.props;
            if (this.state.requestId !== requestId) {
                return;
            }

            if (maxAllowed < inp) {
                this.setState({
                    errMsg: t('errorCannotMintOverReserve', { maxAllowed, name: reserveName }),
                });
                return;
            }

            this.setState({
                errMsg: '',
            });
        });
    }

    updateParams(amount: any, requestId: string) {
        if (!amount || !amount.trim()) {
            this.setState({
                mintErgVal: 0,
                mintErgFee: 0,
            });
            return;
        }

        Promise.all([priceToMintRc(amount), feeToMintRc(amount)]).then(([tot, fee]) => {
            if (this.state.requestId === requestId) {
                this.setState({
                    mintErgFee: fee / 1e9,
                    mintErgVal: (tot - fee) / 1e9,
                });
            }
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
        if (!isWalletSaved()) {
            toast.warn(t('warnSetWallet'));
            this.setState({ isWalletModalOpen: true });
            return;
        }
        this.setState({ loading: true });
        mintRc(this.state.amount)
            .then((res) => {
                if (isDappWallet()) {
                    walletSendFunds({ ERG: res.price }, res.addr).then((res) => {
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
            <Card title={`${t('purchase')} ${reserveName}`}>
                <Switch leftSide={ergCoin} rightSide={reserveAcronym} />
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
                        {this.state.amount} {reserveName} ≈ {this.state.mintErgVal.toFixed(3)} ERG
                    </p>
                    <p>
                        <Trans i18nKey="fee" /> ≈ {this.state.mintErgFee.toFixed(3)} ERG{' '}
                    </p>
                    <p>
                        <Trans i18nKey="youPay" /> ≈{' '}
                        {(this.state.mintErgVal + this.state.mintErgFee).toFixed(3)} ERG{' '}
                    </p>
                </div>
                <button
                    className="mt-sm-15 mt-xl-40 mt-lg-25 btn btn--white"
                    onClick={() => this.startRcRedeem()}
                    disabled={this.state.loading || this.state.errMsg || !this.state.amount}
                >
                    {this.state.loading ? <Loader /> : <Trans i18nKey="purchaseButton" />}
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
