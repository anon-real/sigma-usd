import React, { useCallback, useEffect, useState } from 'react';
import { usdName } from 'utils/consts';
import { Trans, useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import CoinsInfo from './components/CoinsInfo/CoinsInfo';
import PersonalInfo from './components/PersonalInfo/PersonalInfo';
import { ReserveInfo } from './components/ReserveInfo/ReserveInfo';
import Header from '../../components/Header/Header';
import './Home.scss';
import { getBalanceFor } from '../../utils/explorer';
import { getWalletAddress, isWalletSaved } from '../../utils/helpers';
import { ergBalance, rcBalance, rcPrice, scBalance, scPrice } from '../../utils/ageHelper';
import Footer from 'components/Footer/Footer';
import { Navigation } from 'components/Navigation/Navigation';

const Home = () => {
    const [ergVal, setErgVal] = useState<number | undefined>(undefined);
    const [reserveVal, setReserveVal] = useState<number | undefined>(undefined);
    const [stableVal, setStableVal] = useState<number | undefined>(undefined);

    const updateParams = useCallback(async () => {
        if (isWalletSaved()) {
            const bal = await getBalanceFor(getWalletAddress());
            const ageBal = (await scBalance(bal)) / 100;
            let ergBal = (await ergBalance(bal)) / 1e9;
            let reserveBal = await rcBalance(bal);
            const agePrice = (await scPrice()) / 1e7;
            const reservePrice = (await rcPrice()) / 1e9;
            ergBal /= agePrice;
            reserveBal = (reserveBal * reservePrice) / agePrice;
            setReserveVal(reserveBal);
            setStableVal(ageBal);
            setErgVal(ergBal);
        }
    }, []);

    useEffect(() => {
        const id = setInterval(updateParams, 30000);
        updateParams();
        return () => {
            clearInterval(id);
        };
    }, [updateParams]);

    useTranslation();

    return (
        <>
            <Header />
            <main className="main-container">
                <Navigation />

                <section className="finance-description">
                    <div className="finance-description__title">
                        <div className="finance-description__title_part1">The</div>
                        <div className="finance-description__title_part2">{usdName}</div>
                        <div className="finance-description__title_part3">Stablecoin</div>
                    </div>

                    <div className="finance-description__text">
                        <Trans i18nKey="financeDescriptionText1" components={{ br: <br /> }} />
                        <br />
                        <br />
                        <Trans i18nKey="financeDescriptionText2" />
                        <br />
                        <br />
                        <Trans i18nKey="financeDescriptionText3" />{' '}
                        <a
                            target="_blank"
                            href="https://ergoplatform.org/en/blog/2021-02-05-building-ergo-how-the-ageusd-stablecoin-works/"
                            rel="noreferrer noopener"
                        >
                            <Trans i18nKey="financeDescriptionAgeUSDProtocolText" />
                        </a>
                    </div>
                </section>

                <CoinsInfo />
                <ReserveInfo />
                { isWalletSaved() && <PersonalInfo ergVal={ergVal} stableVal={stableVal} reserveVal={reserveVal} /> }

                <Footer />

            </main>
        </>
    );
};

export default Home;
