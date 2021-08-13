import React from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../../components/Header/Header';
import PurchaseForm from './components/PurchaseForm/PurchaseForm';
import RedeemForm from './components/RedeemForm/RedeemForm';
import './Reservecoin.scss';
import { Trans, useTranslation } from 'react-i18next';
import Footer from 'components/Footer/Footer';
import { Navigation } from 'components/Navigation/Navigation';

const Reservecoin = () => {

    useTranslation();

    return (
        <div className="main">
            <Header />
            <div className="mt-xl-60 mt-10 mt-lg-40 a-container">
                <Navigation />
                <div className="top-section">
                    <h2 className="top-section__title">
                        <Trans i18nKey="purchase" />{' '}
                        <span className="top-section__title--ampersand">
                            & <Trans i18nKey="redeem" /> <span className="top-section__title--colored">SigmaRSV</span>
                        </span>
                    </h2>
                    <p className="top-section__paragraph">
                        <Trans i18nKey="reserveTag" />
                    </p>
                </div>
                <div className="reservecoin-cards">
                    <PurchaseForm />
                    <RedeemForm />
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Reservecoin;
