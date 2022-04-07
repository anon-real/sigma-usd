import React from 'react';
import { Trans } from 'react-i18next';

import styles from './NautilusTab.module.scss';

export const NautilusTab = ({ address }: any) => {
    return (
        <div className={styles.nautilusTab}>
            <div className="wallet-modal__input-group">
                <label htmlFor="address" className="wallet-modal__input-label">
                    <Trans i18nKey="address" />
                </label>
                <input
                    defaultValue={address}
                    value={address}
                    disabled
                    className="wallet-modal__input"
                    id="address"
                />
            </div>
        </div>
    );
};
