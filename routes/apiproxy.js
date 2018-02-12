const proxy = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const defaultHost = 'http://localhost:8080';

const useApiAuth = (process.env.USE_API_GATEWAY_AUTH || 'no') === 'yes';
const baseUrl = process.env.API_ENDPOINT_URL || `${defaultHost}/api`;

function generateToken() {
    const nomsToken = process.env.NOMS_TOKEN;
    const milliseconds = Math.round((new Date()).getTime() / 1000);

    const payload = {
        iat: milliseconds,
        token: nomsToken,
    };

    const privateKey = process.env.NOMS_PRIVATE_KEY || '';
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
        '^/api': 'api',                    // rewrite path
        '^/oauth': 'oauth',                    // rewrite path
        '^/info': 'info',                    // rewrite path
        '^/health': 'health',
    },
    onProxyReq: onProxyRequest
};

// create the proxy (without context)
const apiProxy = proxy(options);

module.exports = apiProxy;
