import React, { ChangeEvent, Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Trans, withTranslation } from 'react-i18next';
import './Header.scss';
import format from 'format-number';
import { DropdownMenu } from 'components/DropdownMenu/DropdownMenu';
import LanguageSelector from 'components/LanguageSelector/LanguageSelector';
import { rcBalance, scBalance } from '../../utils/ageHelper';
import { friendlyAddress, getWalletAddress, isDappWallet, isWalletSaved } from '../../utils/helpers';
import WalletModal from '../WalletModal/WalletModal';
import { getBalanceFor } from '../../utils/explorer';
import { getDappBalance } from '../../utils/walletUtils';
import { sigRsvTokenId, sigUsdTokenId } from '../../utils/consts';

export class HeaderComponent extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            ageBal: 0,
            reserveBal: 0,
            isModalOpen: false,
        };
    }

    componentDidMount() {
        this.updateBal();
    }

    async updateBal() {
        if (isWalletSaved()) {
            if (isDappWallet()) {
                const ageBal = await getDappBalance(sigUsdTokenId);
                const reserveBal = await getDappBalance(sigRsvTokenId);
                this.setState({ reserveBal, ageBal: (ageBal / 100).toFixed(2) });

            } else {
                const bal = await getBalanceFor(getWalletAddress());
                const ageBal = await scBalance(bal);
                const reserveBal = await rcBalance(bal);
                this.setState({ reserveBal, ageBal: (ageBal / 100).toFixed(2) });
            }
        }
    }

    render() {
        return (
            <header className="header-container">
                <div>
                    <a className="company-name" href="/">
                        Sigma
                        <br className="company-name__br" />
                        USD
                    </a>

                    <nav className="navigation">
                        <NavLink to="/" exact className="navigation__item">
                            <Trans i18nKey="menuDash" />
                        </NavLink>
                        <NavLink to="/stablecoin" className="navigation__item">
                            <Trans i18nKey="menuStableCoin" />
                        </NavLink>
                        <NavLink to="/reservecoin" className="navigation__item">
                            <Trans i18nKey="menuReserveCoin" />
                        </NavLink>
                    </nav>

                    <div className="coins-wrapper">
                        {isWalletSaved() && (
                            <div className="course-box">
                                <div className="course-box__row">
                                    <span className="course-box__key">
                                        Sig<span className="key_bold">USD</span>
                                    </span>
                                    <span className="course-box__value">
                                        {format({ integerSeparator: ' ' })(this.state.ageBal)}
                                    </span>
                                </div>
                                <div className="course-box__row">
                                    <span className="course-box__key">
                                        Sig<span className="key_bold">RSV</span>
                                    </span>
                                    <span className="course-box__value">
                                        {format({ integerSeparator: ' ' })(this.state.reserveBal)}
                                    </span>
                                </div>
                            </div>
                        )}
                        <div
                            className="wallet-btn"
                            onClick={() => this.setState({ isModalOpen: true })}
                        >
                            <svg
                                className="wallet-btn__icon"
                                width="22"
                                height="21"
                                viewBox="0 0 22 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M19.5984 5.08479H3.21872C2.83888 5.08479 2.53122 4.76514 2.53122 4.3705C2.53122 3.97586 2.83888 3.65622 3.21872 3.65622H19.7187C20.0986 3.65622 20.4062 3.33657 20.4062 2.94193C20.4062 1.75845 19.4828 0.799072 18.3437 0.799072H2.53122C1.01227 0.799072 -0.218781 2.07809 -0.218781 3.65622V17.9419C-0.218781 19.5201 1.01227 20.7991 2.53122 20.7991H19.5984C20.8024 20.7991 21.7812 19.8379 21.7812 18.6562V7.22764C21.7812 6.04595 20.8024 5.08479 19.5984 5.08479ZM17.6562 14.3705C16.897 14.3705 16.2812 13.7308 16.2812 12.9419C16.2812 12.1531 16.897 11.5134 17.6562 11.5134C18.4155 11.5134 19.0312 12.1531 19.0312 12.9419C19.0312 13.7308 18.4155 14.3705 17.6562 14.3705Z"
                                    fill="black"
                                />
                            </svg>
                            <span>
                                {isWalletSaved() ? (
                                    friendlyAddress(getWalletAddress(), 3)
                                ) : (
                                    <Trans i18nKey="headerSetWallet" />
                                )}
                            </span>
                        </div>
                    </div>
                    <LanguageSelector />
                    <DropdownMenu />
                </div>
                <WalletModal
                    onClose={() => {
                        this.setState({ isModalOpen: false });
                        this.updateBal();
                    }}
                    open={this.state.isModalOpen}
                />
            </header>
        );
    }
}

export default withTranslation()(HeaderComponent);
