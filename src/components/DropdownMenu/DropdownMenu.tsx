import LanguageSelector from 'components/LanguageSelector/LanguageSelector';
import useOnClickOutside from 'hooks/useClickOutside';
import React, { useRef, useState } from 'react';
import { Trans } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { ReactComponent as BurgerIcon } from '../../assets/images/Icons/BurgerIcon.svg';
import './DropdownMenu.scss';

export const DropdownMenu = () => {
    const ref = useRef<any>(null);
    const [isOpen, setIsOpen] = useState(false);
    useOnClickOutside(ref, () => setIsOpen(false));

    return (
        <div ref={ref} className="dropdown-menu-btn-container">
            <button className="dropdown-menu-btn" onClick={() => setIsOpen(true)} type="button">
                <BurgerIcon width="18" height="18" />
            </button>
            {isOpen && (
                <ul className="dropdown-menu">
                    <li>
                        <NavLink to="/refund">
                            <Trans i18nKey="refund" />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/faq">
                            <Trans i18nKey="faq" />
                        </NavLink>
                    </li>
                    <li>
                        <a
                            href="https://github.com/anon-real/sigma-usd"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Github
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://bdkent.github.io/sigmausd-history"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            History
                        </a>
                    </li>
                </ul>
            )}
        </div>
    );
};
