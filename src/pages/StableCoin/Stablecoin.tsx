import React from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../../components/Header/Header';
import PurchaseForm from './components/PurchaseForm/PurchaseForm';
import RedeemForm from './components/RedeemForm/RedeemForm';
import './Stablecoin.scss';
import { useTranslation, Trans } from 'react-i18next';

const Stablecoin = () => {

    useTranslation();

    return (
        <div className="main">
            <Header />

            <div className="mt-xl-60 mt-10 mt-lg-40 a-container">
                <section className="main-navigation">
                    <nav className="main-navigation__list">
                        <NavLink exact to="/">
                            <span>
                                <Trans i18nKey="menuDash" />
                            </span>
                        </NavLink>
                        <NavLink to="/stablecoin">
                            <span>
                                <Trans i18nKey="menuStableCoin" />
                            </span>
                        </NavLink>
                        <NavLink to="/reservecoin">
                            <span>
                                <Trans i18nKey="menuReserveCoin" />
                            </span>
                        </NavLink>
                    </nav>
                </section>

                <div className="top-section">
                    <h2 className="top-section__title">
                        <Trans i18nKey="purchase" />{' '}
                        <span className="top-section__title--ampersand">
                            & <Trans i18nKey="redeem" /> <span className="top-section__title--colored">SigmaUSD</span>
                        </span>
                    </h2>
                    <p className="top-section__paragraph"><Trans i18nKey="stableTag"/></p>
                </div>
                <div className="reservecoin-cards">
                    <PurchaseForm />
                    <RedeemForm />
                </div>
                <footer className="footer mt-auto py-3">
                    <span className="text-muted">
                        <a href="https://ergoplatform.org/" target="_blank">
                            ergoplatform.org
                        </a>{' '}
                        <a>|</a>
                        <a href="https://sigmaverse.io/" target="_blank">
                            {' '}
                            sigmaverse.io
                        </a>{' '}
                        <a>|</a>
                        <a href="https://ergonaut.space/" target="_blank">
                            {' '}
                            ergonaut.space
                        </a>{' '}
                        <a>|</a>
                        <a href="https://github.com/anon-real/sigma-usd" target="_blank">
                            {' '}
                            github
                        </a>
                    </span>

                    <div className="switch-site-button">
                        <a href="https://old.sigmausd.io" rel="noopener noreferer">
                            <Trans i18nKey="viewSigmaUSDV1Text" />
                        </a>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Stablecoin;
