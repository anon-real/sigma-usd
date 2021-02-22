import React from 'react';
import ReactDOM from 'react-dom';
import { unregister } from './registerServiceWorker';
import 'react-toastify/dist/ReactToastify.min.css';
import './assets/styles/index.scss';

if (!window.BigUint64Array) {
    const rootElement = document.getElementById('root');
    ReactDOM.render( 
        <div className = "browser-support"> 
        Unfortunately, Safari and Internet Explorer do not yet support BigUint64Array which is required
        for the sites core functionality. 
        <br/><br/>
        Please use the latest version of Firefox, Brave Browser, or Chrome instead. 
        </div>, rootElement
        )
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