import css from './RefundPage.module.scss'

import cn from 'classnames'
import Header from 'components/Header/Header';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { getWalletAddress } from 'utils/helpers';
import { returnFunds } from 'utils/assembler';
import { toast } from 'react-toastify';

export const RefundPage = () => {

    const { t } = useTranslation();

    const [from, setFrom] = useState(getWalletAddress())
    const [to, setTo] = useState('')

    const handleSubmit = () => {
        return returnFunds(from, to).then(res => {
            if (res?.success === false) {
                toast.error(res?.detail ?? 'unknown error')
               
            } else {
                toast.success(res)
            }
        }).catch(e => toast.error(e?.toString() ?? 'unknown error'))
    }

    return (
        <>
            <Header />
            <main className="main-container">
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
                        <Trans i18nKey="refund" />{' '}
                    </h2>
                    <p className="top-section__paragraph">
                        <Trans i18nKey="refundDescription" />
                    </p>
                </div>


                <div className={cn('card', css.card)}>
                    <h3 className="card__title"><Trans i18nKey="refundForm" /></h3>
                    <div className="form">
                        <div className={cn('input', css.input)}>
                            <div className="input-group">
                                <input
                                    value={from}
                                    onChange={(e) => {
                                        setFrom(e.target.value);
                                    }}
                                    placeholder={t('refundToPlaceholder')}
                                />
                            </div>
                        </div>
                        <div className={cn('input', css.input)}>
                            <div className="input-group">
                                <input
                                    value={to}
                                    onChange={(e) => {
                                        setTo(e.target.value);
                                    }}
                                    placeholder={t('refundFromPlaceholder')}
                                />
                            </div>

                            <button
                                className="mt-sm-15 mt-xl-40 mt-lg-25 btn btn--white"
                                onClick={handleSubmit}
                                disabled={!from || !to}
                            >
                                <Trans i18nKey="refundSubmit" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}