const config = require('./webpack.config');
module.exports = Object.assign(config, {
    mode: "development",
    devtool: 'source-map',
    devServer: {
        headers: (data) => {
            if (data.baseUrl === '/id') {
                return {'Content-Type': 'application/ld+json'}
            }

            return {};
        }
    },
})
