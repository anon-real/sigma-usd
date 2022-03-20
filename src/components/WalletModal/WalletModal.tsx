import ModalContainer from 'components/ModalContainer/ModalContainer';
import React, { useState } from 'react';
import {
    clearWallet,
    getWalletAddress,
    isAddressValid, setAnyWallet, setNautilusWallet, setYoroiWallet
} from '../../utils/helpers';
import { toast } from 'react-toastify';
import { Trans, useTranslation } from 'react-i18next';
import { setupWallet } from '../../utils/walletUtils';

interface Props {
    onClose: () => void;
    open: boolean;
}

enum Wallets {
    ANY_WALLET = 'ANY_WALLET',
}

const TABS = {
    [Wallets.ANY_WALLET]: 'tabSetWallet',
};

const WalletModal = ({ open, onClose }: Props) => {
    const [currentTab, setCurrentTab] = useState(Wallets.ANY_WALLET);
    const [address, setAddress] = useState(getWalletAddress);

    const { t } = useTranslation();

    return (
        <ModalContainer open={open} onClose={onClose}>
            <div className="wallet-modal">
                <div className="wallet-modal__tabs">
                    {Object.keys(TABS).map((key) => (
                        <div
                            key={key}
                            className="wallet-modal__tab"
                            onClick={() => setCurrentTab(key as Wallets)}
                        >
                            <Trans i18nKey={TABS[key as Wallets]} />
                        </div>
                    ))}
                </div>
                <div className="wallet-modal__content">
                    {currentTab === Wallets.ANY_WALLET && (
                        <>
                            <p className="wallet-modal__paragraph">
                                <Trans i18nKey="setWalletContent1" />
                            </p>
                            <p className="wallet-modal__paragraph">
                                <Trans i18nKey="setWalletContent2" />
                            </p>
                            <p className="wallet-modal__paragraph">
                                <Trans i18nKey="setWalletContent3" />
                            </p>
                            <div className="wallet-modal__input-group">
                                <label
                                    htmlFor="address"
                                    className="wallet-modal__input-label"
                                >
                                    <Trans i18nKey="address"/>
                                </label>
                                <input
                                    defaultValue={getWalletAddress()}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="wallet-modal__input"
                                    id="address"
                                />
                                <span className="wallet-modal__input-subtext">
                                    <Trans i18nKey="addressNote"/>
                                </span>


                            </div>

                            <p className="wallet-modal__paragraph">
                            <br></br>
                                <Trans i18nKey="assemblerNote"/>{' '}
                            <a
                                href="https://www.ergoforum.org/t/tx-assembler-service-bypassing-node-requirement-for-dapps/443"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Trans i18nKey="assemblerNoteLinkHere"/>
                            </a>
                            .
</p>
                        </>
                    )}
                </div>
                <div className="wallet-modal__buttons">
                    <button
                        onClick={() => {
                            setAnyWallet(address);
                            toast.success(t('successSetWallet'));
                            onClose();
                        }}
                        disabled={!isAddressValid(address)}
                        type="button"
                        className="btn-blue mr-lg-20 mr-0"
                    >
                        <Trans i18nKey="save" />
                    </button>
                    <button
                        onClick={() => {
                            setupWallet(true, 'Yoroi').then(address => {
                                setYoroiWallet(address);
                                onClose();
                            })
                        }}
                        type="button"
                        className="btn-blue mr-lg-20 mr-0"
                    >
                        <Trans i18nKey="Yoroi" />
                    </button>
                    <button
                        onClick={() => {
                            setupWallet(true, 'Nautilus').then(address => {
                                setNautilusWallet(address);
                                console.log(onClose)
                                onClose();
                            })
                        }}
                        type="button"
                        className="btn-blue mr-lg-20 mr-0"
                    >
                        <Trans i18nKey="Nautilus" />
                    </button>
                    <button
                        onClick={() => {
                            toast.success(t('successClearWallet'));
                            clearWallet();
                            setAddress('');
                            onClose();
                        }}
                        type="button"
                        className="btn-black"
                    >
                        <Trans i18nKey="clearWallet" />
                    </button>
                </div>
            </div>
        </ModalContainer>
    );
};

export default WalletModal;
