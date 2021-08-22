import React from 'react';
import { Trans } from 'react-i18next';
import { NavLink } from 'react-router-dom';

export const Navigation = () => {
    return (
        <section className="main-navigation">
            <nav className="main-navigation__list">
                <NavLink exact to="/">
                    <span>
                        <Trans i18nKey="menuDash" />
                    </span>
                </NavLink>
                <NavLink exact to="/stablecoin">
                    <span>
                        <Trans i18nKey="menuStableCoin" />
                    </span>
                </NavLink>
                <NavLink exact to="/reservecoin">
                    <span>
                        <Trans i18nKey="menuReserveCoin" />
                    </span>
                </NavLink>
            </nav>
        </section>
    )
}
