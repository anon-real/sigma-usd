import React, { useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
// import registerServiceWorker from './registerServiceWorker';

import { HashRouter, Switch, Route } from 'react-router-dom';
// import './assets/base.css';
import { ToastContainer } from 'react-toastify';
import ReserveCoin from './pages/ReserveCoin/Reservecoin';
import configureStore from './config/configureStore';
import { Provider } from 'react-redux';
import { forceUpdateState } from './utils/ageHelper';
import { reqFollower } from './utils/assembler';
import Stablecoin from './pages/StableCoin/Stablecoin';
import { RefundPage } from './pages/RefundPage/RefundPage';
import Home from './pages/Home/Home';
import { FaqPage } from 'pages/Faq/FaqPage';
import { setupWallet } from 'utils/walletUtils';
import { getWalletType } from 'utils/helpers';
import { useWallet, WalletContextProvider } from 'providers/WalletContext';

const store = configureStore();
const rootElement = document.getElementById('root');

const App = () => {
    forceUpdateState();

    setInterval(() => {
        forceUpdateState();
    }, 20000);

    setInterval(() => {
        reqFollower();
    }, 10000);

    return (
        <React.Suspense fallback="loading">
            <Provider store={store}>
                <WalletContextProvider>
                    <HashRouter>
                    <Switch>
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route path="/stablecoin">
                            <Stablecoin />
                        </Route>
                        <Route path="/reservecoin">
                            <ReserveCoin />
                        </Route>
                        <Route path="/faq/:slug?">
                            <FaqPage />
                        </Route>
                        <Route path="/refund">
                            <RefundPage />
                        </Route>
                    </Switch>
                    </HashRouter>
                </WalletContextProvider>
            </Provider>
            <ToastContainer closeButton={false} autoClose={10000} />
        </React.Suspense>
    )
}

export const initApp = () => {
    ReactDOM.render(
        <App />,
        rootElement
    );
}
