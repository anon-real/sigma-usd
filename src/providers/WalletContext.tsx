import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getWalletAddress, getWalletType, setWallet, showMsg } from 'utils/helpers';

export enum WalletConnectionState {
    NOT_CONNECTED, // initial state
    CONNECTED,
    DISCONNECTED,
}

export enum WalletType {
    YOROI = 'YOROI',
    NAUTILUS = 'NAUTILUS',
    ANY = 'ANY',
}

export type WalletContextType = {
    walletType: WalletType;
    walletConnectionState: WalletConnectionState;
    setIsWalletConnected: (isWalletConnected: boolean) => void;
    isWalletLoading: boolean;
    isWalletConnected: boolean;
    address: string;
    setAddress: (address: string) => void;
    setupWallet: (newWalletType: WalletType) => void;
    walletInit: () => void;
    getUtxos: () => void;
};

function noop() {}

const initialState = {
    walletType: WalletType.ANY,
    walletConnectionState: WalletConnectionState.NOT_CONNECTED,
    address: '',
    setIsWalletConnected: noop,
    isWalletLoading: false,
    isWalletConnected: false,
    setupWallet: noop,
    setAddress: () => {},
    walletInit: noop,
    getUtxos: noop,
    getBalance: noop,
};
export const WalletContext = createContext<WalletContextType>(initialState);

export const useWallet = (): WalletContextType => useContext(WalletContext);

export const checkIsDappWalletConnected = (walletType: WalletType) => {
    // eslint-disable-next-line default-case
    switch (walletType) {
        case WalletType.NAUTILUS: {
            return window.ergoConnector?.nautilus?.isConnected();
        }
        default: {
            return false;
        }
    }
};

export const getDappAddress = async (walletType: WalletType) => {
    // eslint-disable-next-line default-case
    switch (walletType) {
        case WalletType.NAUTILUS: {
            return window.ergo.get_change_address();
        }
        case WalletType.YOROI: {
            return window.ergo.get_change_address();
        }
        default: {
            return '';
        }
    }
};

export const getDappBalance = async (walletType: WalletType) => {
    // eslint-disable-next-line default-case
    switch (walletType) {
        case WalletType.NAUTILUS: {
            return window.ergo.get_change_address();
        }
        case WalletType.YOROI: {
            return window.ergo.get_change_address();
        }
        default: {
            return '';
        }
    }
};

export const WalletContextProvider = ({
    children,
}: React.PropsWithChildren<unknown>): JSX.Element => {
    const [walletType, setWalletType] = useState(initialState.walletType);
    const [walletConnectionState, setWalletConnectionState] = useState(
        WalletConnectionState.NOT_CONNECTED,
    );
    const [address, setAddress] = useState(initialState.address);
    const [isWalletLoading, setIsWalletLoading] = useState<boolean>(false);

    const setIsWalletConnected = useCallback((isConnected: boolean) => {
        setWalletConnectionState(
            isConnected ? WalletConnectionState.CONNECTED : WalletConnectionState.DISCONNECTED,
        );
    }, []);

    const walletInit = useCallback(async () => {
        const type = getWalletType();
        setIsWalletLoading(true);
        if (type === WalletType.ANY || !type) {
            setWalletConnectionState(WalletConnectionState.CONNECTED);
            const walletAddress = getWalletAddress();
            setAddress(walletAddress);
            setWalletType(WalletType.ANY);
            setIsWalletLoading(false);
        } else {
            const isWalletConnected = await checkIsDappWalletConnected(type);

            if (!isWalletConnected) {
                setWalletType(WalletType.ANY);
                setWalletConnectionState(WalletConnectionState.CONNECTED);
                setWallet(WalletType.ANY, '');
                setIsWalletLoading(false);
                return;
            }

            const dappAddress = await getDappAddress(type);
            setWallet(type, dappAddress);
            setAddress(dappAddress);
            setWalletType(type);
            setWalletConnectionState(WalletConnectionState.CONNECTED);
            setIsWalletLoading(false);
        }
    }, [setWalletType]);

    useEffect(() => {
        walletInit();
    }, []);

    const getUtxos = useCallback(async () => {
        // eslint-disable-next-line default-case
        switch (walletType) {
            case WalletType.NAUTILUS: {
                return (await window.ergoConnector.nautilus.getContext()).get_utxos();
            }
        }
    }, [walletType]);

    const setupWallet = useCallback(
        async (newWalletType: WalletType) => {
            setIsWalletLoading(true);
            // eslint-disable-next-line
            switch (newWalletType) {
                case WalletType.ANY: {
                    setWalletType(WalletType.ANY);
                    setWalletConnectionState(WalletConnectionState.CONNECTED);
                    setWallet(WalletType.ANY, '');
                    setIsWalletLoading(false);
                    break;
                }
                case WalletType.NAUTILUS: {
                    const granted = await window.ergoConnector?.nautilus?.connect({
                        createErgoObject: false,
                    });

                    if (!granted) {
                        showMsg('Wallet access denied', true);
                        setIsWalletLoading(false);
                        return;
                    }

                    const dappAddress = await getDappAddress(newWalletType);
                    setWallet(newWalletType, dappAddress);
                    setAddress(dappAddress);
                    setWalletType(newWalletType);
                    setWalletConnectionState(WalletConnectionState.CONNECTED);
                    setIsWalletLoading(false);
                }
            }
        },
        [setWalletType],
    );

    const isWalletConnected = walletConnectionState === WalletConnectionState.CONNECTED;

    const ctxValue: WalletContextType = {
        walletType,
        walletConnectionState,
        setIsWalletConnected,
        isWalletLoading,
        isWalletConnected,
        setupWallet,
        address,
        setAddress,
        walletInit,
        getUtxos,
    };

    return <WalletContext.Provider value={ctxValue}>{children}</WalletContext.Provider>;
};
