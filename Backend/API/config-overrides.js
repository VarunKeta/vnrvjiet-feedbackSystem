const webpack = require('webpack');

module.exports = function override(config) {
    config.resolve.fallback = {
        crypto: require.resolve('crypto-browserify'),
    };
    return config;
};
