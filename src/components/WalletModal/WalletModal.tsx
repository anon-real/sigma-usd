import ModalContainer from 'components/ModalContainer/ModalContainer';
import React, { useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { checkIsDappWalletExists, useWallet, WalletType } from 'providers/WalletContext';
import { Nautilus } from 'utils/wallets/nautilus';
import { toast } from 'react-toastify';
import { showMsg } from '../../utils/helpers';
// import { YoroiTab } from './YoroiTab';
import { NautilusTab } from './NautilusTab';

interface Props {
    onClose: () => void;
    open: boolean;
}

const TABS = {
    [WalletType.ANY]: 'Any wallet',
    [WalletType.NAUTILUS]: 'Nautilus Wallet',
    // [WalletType.YOROI]: 'Yoroi Wallet',
};

const renderTabContent = ({ currentTab, walletType, address, setWallet }: any) => {
    switch (currentTab) {
        // case WalletType.YOROI: {
        //     return <YoroiTab />;
        // }
        case WalletType.NAUTILUS: {
            return <NautilusTab address={address} />;
        }
        default: {
            return (
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
                        <label htmlFor="address" className="wallet-modal__input-label">
                            <Trans i18nKey="address" />
                        </label>
                        <input
                            defaultValue={address}
                            value={address}
                            onChange={(e) => setWallet(walletType, e.target.value)}
                            className="wallet-modal__input"
                            id="address"
                        />
                        <span className="wallet-modal__input-subtext">
                            <Trans i18nKey="addressNote" />
                        </span>
                    </div>

                    <p className="wallet-modal__paragraph">
                        <br />
                        <Trans i18nKey="assemblerNote" />{' '}
                        <a
                            href="https://www.ergoforum.org/t/tx-assembler-service-bypassing-node-requirement-for-dapps/443"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Trans i18nKey="assemblerNoteLinkHere" />
                        </a>
                        .
                    </p>
                </>
            );
        }
    }
};

const WalletModalContent = ({ open, onClose }: any) => {
    const walletState = useWallet();
    const { address, walletType, setWalletTypeAndAddress: setWallet, setupWallet } = walletState;
    const [currentTab, setCurrentTab] = useState(walletType);

    const changeTab = useCallback(
        async (newTab) => {
            // eslint-disable-next-line default-case
            switch (newTab) {
                case WalletType.ANY: {
                    setupWallet(newTab);
                    setCurrentTab(newTab);
                    break;
                }
                case WalletType.NAUTILUS: {
                    const isNautilusExists = await checkIsDappWalletExists(newTab);

                    if (!isNautilusExists) {
                        window.open(Nautilus.extensionLink, '_blank');
                        break;
                    }

                    const isWalletSetup = await setupWallet(newTab);

                    if (isWalletSetup) {
                        showMsg('Successfully connected to Nautilus');
                        setCurrentTab(newTab);
                    }

                    break;
                }
                default: {
                    break;
                }
            }
        },
        [setupWallet],
    );

    const { t } = useTranslation();

    return (
        <ModalContainer open={open} onClose={onClose}>
            <div className="wallet-modal">
                <div className="wallet-modal__tabs">
                    {Object.keys(TABS).map((key) => (
                        <div
                            key={key}
                            className={classNames('wallet-modal__tab', {
                                active: key === currentTab,
                            })}
                            onClick={() => changeTab(key as WalletType.ANY | WalletType.NAUTILUS)}
                        >
                            <Trans i18nKey={TABS[key as WalletType.ANY | WalletType.NAUTILUS]} />
                        </div>
                    ))}
                </div>
                <div className="wallet-modal__content">
                    {renderTabContent({ currentTab, walletType, address, setWallet, walletState })}
                </div>
                <div className="wallet-modal__buttons">
                    {/* <button
                        onClick={() => {
                            setAnyWallet(address);
                            toast.success(t('successSetWallet'));
                            onClose();
                        }}
                        disabled={!isAddressValid(address)}
                        type="button"
                        className="btn-blue mr-lg-20 mr-0"
                    >
                        <Trans i18nKey="close" />
                    </button> */}
                    {/* <button
                        onClick={() => {
                            setupWallet(true, 'Nautilus').then((address) => {
                                setNautilusWallet(address);
                                console.log(onClose);
                                onClose();
                            });
                        }}
                        type="button"
                        className="btn-blue mr-lg-20 mr-0"
                    >
                        <Trans i18nKey="Nautilus" />
                    </button> */}
                    <button
                        onClick={() => {
                            toast.success(t('successClearWallet'));
                            changeTab(WalletType.ANY);
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

const WalletModal = ({ open, onClose }: Props) => {
    const { isWalletInitialized } = useWallet();

    if (!isWalletInitialized) {
        return null;
    }

    return <WalletModalContent open={open} onClose={onClose} />;
};

export default WalletModal;
