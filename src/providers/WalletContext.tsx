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
    setWalletTypeAndAddress: (type: WalletType, address: string) => void;
    setupWallet: (newWalletType: WalletType) => Promise<boolean>;
    walletInit: () => void;
    getUtxos: () => void;
    isWalletInitialized: boolean;
    getTokenBalance: (token: string) => Promise<string>;
};

function noop() {}

const initialState = {
    walletType: WalletType.ANY,
    walletConnectionState: WalletConnectionState.NOT_CONNECTED,
    address: '',
    setIsWalletConnected: noop,
    isWalletLoading: false,
    isWalletConnected: false,
    setupWallet: () => Promise.resolve(false),
    setWalletTypeAndAddress: noop,
    walletInit: noop,
    getUtxos: noop,
    getBalance: noop,
    isWalletInitialized: false,
    getTokenBalance: () => Promise.resolve(''),
};
export const WalletContext = createContext<WalletContextType>(initialState);

export const useWallet = (): WalletContextType => useContext(WalletContext);

export const checkIsDappWalletExists = (walletType: WalletType) => {
    // eslint-disable-next-line default-case
    switch (walletType) {
        case WalletType.NAUTILUS: {
            return window.ergoConnector?.nautilus;
        }
        default: {
            return false;
        }
    }
};

export const connectWallet = async (walletType: WalletType) => {
    switch (walletType) {
        case WalletType.NAUTILUS: {
            const granted = await window.ergoConnector?.nautilus?.connect({
                createErgoObject: false,
            });

            if (!granted) {
                showMsg('Wallet access denied', true);
                return false;
            }

            return true;
        }
    }
};

export const checkIsDappWalletConnected = async (walletType: WalletType) => {
    // eslint-disable-next-line default-case
    switch (walletType) {
        case WalletType.NAUTILUS: {
            return window.ergoConnector?.nautilus?.isConnected();
        }
        case WalletType.YOROI: {
            return window.ergo.check_read_access();
        }
        default: {
            // never
            return false;
        }
    }
};

export const getDappAddress = async (walletType: WalletType) => {
    // eslint-disable-next-line default-case
    switch (walletType) {
        case WalletType.NAUTILUS: {
            return (await window.ergoConnector.nautilus.getContext()).get_change_address();
        }
        case WalletType.YOROI: {
            return window.ergo.get_change_address();
        }
        default: {
            // never
            return '';
        }
    }
};

export const getDappBalance = async (walletType: WalletType) => {
    // eslint-disable-next-line default-case
    switch (walletType) {
        case WalletType.NAUTILUS: {
            return (await window.ergoConnector.nautilus.getContext()).get_change_address();
        }
        case WalletType.YOROI: {
            return window.ergo.get_change_address();
        }
        default: {
            // never
            return '';
        }
    }
};

export const WalletContextProvider = ({
    children,
}: React.PropsWithChildren<unknown>): JSX.Element => {
    const [walletType, setWalletType] = useState(initialState.walletType);
    const [isWalletInitialized, setIsWalletInitialized] = useState(
        initialState.isWalletInitialized,
    );
    const [walletConnectionState, setWalletConnectionState] = useState(
        WalletConnectionState.NOT_CONNECTED,
    );
    const [address, setAddress] = useState(initialState.address);
    const [isWalletLoading, setIsWalletLoading] = useState<boolean>(false);

    const setWalletTypeAndAddress = useCallback(
        (type: WalletType, newAddress: string) => {
            setAddress(newAddress);
            setWalletType(type);
            setWallet(type, newAddress);
        },
        [setAddress, setWalletType],
    );

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
            setWalletTypeAndAddress(WalletType.ANY, walletAddress);
            setIsWalletLoading(false);
            setIsWalletInitialized(true);
        } else {
            const isWalletExists = await checkIsDappWalletExists(type);

            if (!isWalletExists) {
                setWalletType(WalletType.ANY);
                setWalletConnectionState(WalletConnectionState.CONNECTED);
                setWallet(WalletType.ANY, '');
                setIsWalletLoading(false);
                setIsWalletInitialized(true);
                return;
            }

            const isWalletConnected = await connectWallet(type);

            if (!isWalletConnected) {
                setWalletType(WalletType.ANY);
                setWalletConnectionState(WalletConnectionState.CONNECTED);
                setWallet(WalletType.ANY, '');
                setIsWalletLoading(false);
                setIsWalletInitialized(true);
                return;
            }

            const dappAddress = await getDappAddress(type);
            setWalletTypeAndAddress(type, dappAddress);
            setWalletConnectionState(WalletConnectionState.CONNECTED);
            setIsWalletLoading(false);
            setIsWalletInitialized(true);
        }
    }, [setWalletTypeAndAddress, setWalletType]);

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

    const getTokenBalance = useCallback(
        async (token = 'ERG') => {
            // eslint-disable-next-line default-case
            switch (walletType) {
                case WalletType.NAUTILUS: {
                    return (await window.ergoConnector.nautilus.getContext()).get_balance(token);
                }
                default: {
                    // never
                    return Promise.resolve('');
                }
            }
        },
        [walletType],
    );

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
                    return true;
                }
                case WalletType.NAUTILUS: {
                    const isWalletConnected = await connectWallet(newWalletType);

                    if (!isWalletConnected) {
                        return false;
                    }

                    const dappAddress = await getDappAddress(newWalletType);
                    setWallet(newWalletType, dappAddress);
                    setAddress(dappAddress);
                    setWalletType(newWalletType);
                    setWalletConnectionState(WalletConnectionState.CONNECTED);
                    setIsWalletLoading(false);
                    showMsg('Successfully connected to Nautilus');

                    return true;
                }
                default: {
                    setWalletType(WalletType.ANY);
                    setWalletConnectionState(WalletConnectionState.CONNECTED);
                    setWallet(WalletType.ANY, '');
                    setIsWalletLoading(false);
                    return true;
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
        setWalletTypeAndAddress,
        walletInit,
        getUtxos,
        isWalletInitialized,
        getTokenBalance,
    };

    return <WalletContext.Provider value={ctxValue}>{children}</WalletContext.Provider>;
};
