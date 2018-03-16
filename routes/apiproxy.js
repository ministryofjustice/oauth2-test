const proxy = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const config = require('./config');

const useApiAuth = (process.env.USE_API_GATEWAY_AUTH || 'no') === 'yes';
const baseUrl = process.env.API_ENDPOINT_URL || `${config.defaultHost}/api`;

function generateToken() {
    const nomsToken = process.env.API_GATEWAY_TOKEN;
    const milliseconds = Math.round((new Date()).getTime() / 1000);

    const payload = {
        iat: milliseconds,
        token: nomsToken,
    };

    const base64PrivateKey = process.env.API_GATEWAY_PRIVATE_KEY || '';
    const privateKey = Buffer.from(base64PrivateKey, 'base64');
    const cert = new Buffer(privateKey);
    return jwt.sign(payload, cert, { algorithm: 'ES256' });
}

const onProxyRequest = (proxyReq, req) => {
    const authHeader = req.headers.authorization;

    if (authHeader !== undefined) {
        proxyReq.setHeader('elite-authorization', authHeader);
    }

    if (useApiAuth) {
        // Add Api Gateway JWT header token
        try {
            const jwToken = generateToken();
            proxyReq.setHeader('authorization', `Bearer ${jwToken}`);
        } catch (err) {
            proxyReq.setHeader('authorization', 'JUNK');
        }
    }
};


const options = {
    target: baseUrl,                  // target host
    changeOrigin: true,               // needed for virtual hosted sites
    ws: true,                         // proxy websockets
    pathRewrite: {
        '^/api': '',                    // rewrite path
        '^/oauth': 'elite2api/oauth',   // rewrite path
    },
    onProxyReq: onProxyRequest
};

// create the proxy (without context)
const apiProxy = proxy(options);

module.exports = apiProxy;
