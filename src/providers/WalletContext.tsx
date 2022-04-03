import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getWalletAddress, getWalletType } from 'utils/helpers';
import { setupYoroi } from 'utils/walletUtils';

import { useInterval } from '../hooks/useInterval';

export enum WalletConnectionState {
    NOT_CONNECTED, // initial state
    CONNECTED,
}

export enum WalletType {
    YOROI,
    NAUTILUS,
    ANY,
}

export type WalletContextType = {
    walletType: WalletType;
    walletConnectionState: WalletConnectionState;
    setIsWalletConnected: (isWalletConnected: boolean) => void;
    isWalletLoading: boolean;
    setupWallet: (newWalletType: WalletType) => void;
};

function noop() {}

const initialState = {
    walletType: getWalletType() || WalletType.ANY,
    walletConnectionState: WalletConnectionState.NOT_CONNECTED,
    setIsWalletConnected: noop,
    isWalletLoading: false,
    setupWallet: noop,
};
export const WalletContext = createContext<WalletContextType>(initialState);

export const useWallet = (): WalletContextType => useContext(WalletContext);

export const WalletContextProvider = ({
    children,
}: React.PropsWithChildren<unknown>): JSX.Element => {
    const [walletType, setWalletType] = useState(initialState.walletType);
    const [walletConnectionState, setWalletConnectionState] = useState(
        WalletConnectionState.NOT_CONNECTED,
    );
    const [isWalletLoading, setIsWalletLoading] = useState<boolean>(false);

    const setIsWalletConnected = useCallback((isConnected: boolean) => {
        setWalletConnectionState(
            isConnected ? WalletConnectionState.CONNECTED : WalletConnectionState.DISCONNECTED,
        );
    }, []);

    const setupWallet = useCallback(
        (newWalletType: WalletType) => {
            setWalletType(newWalletType);
        },
        [setWalletType],
    );

    const isWalletConnected = walletConnectionState === WalletConnectionState.CONNECTED;

    const ctxValue: WalletContextType = {
        walletType,
        walletConnectionState,
        setIsWalletConnected,
        isWalletLoading,
        setupWallet,
    };

    // useEffect(() => {
    //     if (walletConnectionState) {
    //         setIsWalletLoading(true);
    //         window
    //             .ergo_request_read_access()
    //             .then(setIsWalletConnected)
    //             .finally(() => setIsWalletLoading(false));
    //     }
    // }, [isWalletConnected, setIsWalletConnected]);

    // useEffect(() => {
    //     if (isWalletConnected) {
    //         setIsWalletLoading(true);
    //         Promise.all([
    //             ergo.get_balance(ERG_TOKEN_NAME).then((balance) => {
    //                 setErgBalance(renderFractions(balance, ERG_DECIMALS));
    //             }),
    //         ]).finally(() => setIsWalletLoading(false));
    //     }
    // }, [isWalletConnected]);

    // useInterval(() => {
    //     if (isWalletConnected) {
    //         fetchUtxos().then(setUtxos);
    //         ergo.get_balance(ERG_TOKEN_NAME).then((balance) => {
    //             setErgBalance(renderFractions(balance, ERG_DECIMALS));
    //         });
    //     }
    // }, 10 * 1000);

    return <WalletContext.Provider value={ctxValue}>{children}</WalletContext.Provider>;
};
