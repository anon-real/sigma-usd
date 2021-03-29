import React from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../../components/Header/Header';
import PurchaseForm from './components/PurchaseForm/PurchaseForm';
import RedeemForm from './components/RedeemForm/RedeemForm';
import './Stablecoin.scss';

const Stablecoin = () => {
    return (
        <div className="main">
            <Header />

            <div className="mt-xl-60 mt-10 mt-lg-40 a-container">
                <section className="main-navigation">
                    <nav className="main-navigation__list">
                        <NavLink exact to="/">
                            <span>Dashboard</span>
                        </NavLink>
                        <NavLink to="/stablecoin">
                            <span>StableCoin</span>
                        </NavLink>
                        <NavLink to="/reservecoin">
                            <span>ReserveCoin</span>
                        </NavLink>
                    </nav>
                </section>

                <div className="top-section">
                    <h2 className="top-section__title">
                        Purchase{' '}
                        <span className="top-section__title--ampersand">
                            & Redeem <span className="top-section__title--colored">SigmaUSD</span>
                        </span>
                    </h2>
                    <p className="top-section__paragraph">Welcome to decentralized stability</p>
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
                        {window.location.href.match('old') ? (
                            <a href="https://old.sigmausd.io" rel="noopener noreferer">
                                Old contract version
                            </a>
                        ) : (
                            <a href="https://sigmausd.io" rel="noopener noreferer">
                                New contract version
                            </a>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Stablecoin;
