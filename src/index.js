import React from 'react';
import ReactDOM from 'react-dom';
import { unregister } from './registerServiceWorker';
import 'react-toastify/dist/ReactToastify.min.css';
import './assets/styles/index.scss';

if (!window.BigUint64Array) {
    const rootElement = document.getElementById('root');
    ReactDOM.render(<div className="browser-support">Safari browser doesn't support some core functionalities, please update your browser for a potential fix or use chrome/firefox/brave instead</div>, rootElement)
} else {
    const { initApp } = require('./App');
    initApp();
}

// if (module.hot) {
//     module.hot.accept('./UtilPage/Main', () => {
//         const NextApp = require('./UtilPage/Main').default;
//         renderApp(NextApp);
//     });
// }
unregister();

// registerServiceWorker();
