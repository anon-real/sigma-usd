const path = require('path');
const rewireTypingsForCssModule = require('react-app-rewire-typings-for-css-module');

module.exports = function override(config, env) {

    /**
     * Add WASM support
     */

    // Make file-loader ignore WASM files
    const wasmExtensionRegExp = /\.wasm$/;
    config.resolve.extensions.push('.wasm');
    config.module.rules.forEach(rule => {
        (rule.oneOf || []).forEach(oneOf => {
            if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
                oneOf.exclude.push(wasmExtensionRegExp);
            }
        });
    });

    // Add a dedicated loader for WASM
    config.module.rules.push({
        test: wasmExtensionRegExp,
        include: path.resolve(__dirname, 'src'),
        use: [{ loader: require.resolve('wasm-loader'), options: {} }]
    });

    config = rewireTypingsForCssModule.factory({})(config);

    return config;
};
