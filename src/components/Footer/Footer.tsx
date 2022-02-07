import cn from 'classnames';
import React from 'react';

import { Trans } from 'react-i18next';
import styles from './Footer.module.scss';

const Footer = React.memo(() => {
    return (
        <footer className={cn(styles.footer, 'mt-auto', 'py-3')}>
            <span className="text-muted">
                <a href="https://ergoplatform.org/" target="_blank" rel="noopener noreferrer">
                    ergoplatform.org
                </a>
                <span> | </span>
                <a href="https://sigmaverse.io/" target="_blank" rel="noopener noreferrer">
                    sigmaverse.io
                </a>
                <span> | </span>
                <a href="https://ergonaut.space/" target="_blank" rel="noopener noreferrer">
                    ergonaut.space
                </a>
            </span>

            <div className="switch-site-button">
                <a href="https://old.sigmausd.io" rel="noopener noreferrer">
                    <Trans i18nKey="viewSigmaUSDV1Text" />
                </a>
            </div>
        </footer>
    );
});

export default Footer;
