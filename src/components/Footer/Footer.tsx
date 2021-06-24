import styles from './Footer.module.scss'

import cn from 'classnames';
import React from 'react';

import { Trans } from 'react-i18next';

const Footer = React.memo(() => {
    return (
        <footer className={cn(styles.footer, 'mt-auto', 'py-3')}>
            <span className="text-muted">
                <a href="https://ergoplatform.org/" target="_blank" rel="noopener noreferer">
                    ergoplatform.org
                </a>
                <span>{' '}|{' '}</span>
                <a href="https://sigmaverse.io/" target="_blank" rel="noopener noreferer">
                    sigmaverse.io
                </a>
                <span>{' '}|{' '}</span>
                <a href="https://ergonaut.space/" target="_blank" rel="noopener noreferer">ergonaut.space</a>
                <span>{' '}|{' '}</span>
                <a href="https://bdkent.github.io/sigmausd-history" target="_blank" rel="noopener noreferer">
                    historical data
                </a>
                <span>{' '}|{' '}</span>
                <a href="https://github.com/anon-real/sigma-usd" target="_blank" rel="noopener noreferer">
                    github
                </a>
            </span>

            <div className="switch-site-button">
                <a href="https://old.sigmausd.io" rel="noopener noreferer">
                    <Trans i18nKey="viewSigmaUSDV1Text" />
                </a>
            </div>
        </footer>
    )
});

export default Footer;
