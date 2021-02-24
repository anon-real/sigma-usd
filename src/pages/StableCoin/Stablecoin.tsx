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
            </div>
        </div>
    );
};

export default Stablecoin;
