import React from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../../components/Header/Header';
import PurchaseForm from './components/PurchaseForm/PurchaseForm';
import RedeemForm from './components/RedeemForm/RedeemForm';
import './Reservecoin.scss';

const Reservecoin = () => {
    return (
        <div className="main">
            <Header />
            <div className="mt-xl-60 mt-10  mt-lg-40 a-container">
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
                            & Redeem <span className="top-section__title--colored">SigmaRSV</span>
                        </span>
                    </h2>
                    <p className="top-section__paragraph">Provide liquidity and earn premiums upon redemption</p>
                </div>
                <div className="reservecoin-cards">
                    <PurchaseForm />
                    <RedeemForm />
                </div>

                <footer className="footer mt-auto py-3">
                
                <span className="text-muted"><a href="https://ergoplatform.org/" target="_blank">ergoplatform.org</a>  |  <a href="https://sigmaverse.io/" target="_blank">sigmaverse.io</a> | <a href="https://ergonaut.space/" target="_blank">ergonaut.space</a> </span>
            
            </footer>
            </div>
        </div>
    );
};

export default Reservecoin;
