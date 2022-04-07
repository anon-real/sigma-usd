import React from 'react';
import { Trans } from 'react-i18next';

import styles from './YoroiTab.module.scss';

export const YoroiTab = ({ onClose }: any) => {
    return (
        <div className={styles.yoroiTab}>
            <button
                onClick={() => {
                    // setupWallet('Yoroi').then((address) => {
                    //     setYoroiWallet(address);
                    //     onClose();
                    // });
                }}
                type="button"
                className="btn-blue mr-lg-20 mr-0"
            >
                <Trans i18nKey="connectWallet" />
            </button>
        </div>
    );
};
