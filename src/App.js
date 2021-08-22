import React from 'react';
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

const store = configureStore();
const rootElement = document.getElementById('root');

export const initApp = () => {
    forceUpdateState();
    setInterval(() => {
        forceUpdateState();
    }, 20000);

    setInterval(() => {
        reqFollower();
    }, 10000);

    ReactDOM.render(
        <React.Suspense fallback="loading">
            <Provider store={store}>
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
                    <Route path="/refund">
                        <RefundPage />
                    </Route>
                </Switch>
                </HashRouter>
            </Provider>
            <ToastContainer closeButton={false} autoClose={10000} />
        </React.Suspense>,
        rootElement
    );
}
