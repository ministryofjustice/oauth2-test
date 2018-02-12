'use strict';

const express = require('express');
const router = express.Router();

const simpleOauthModule = require('simple-oauth2');

const defaultHost = 'http://localhost:8080';

const oauth2 = simpleOauthModule.create({
    client: {
        id: 'elite2apitrustedclient',
        secret: 'clientsecret',
    },
    auth: {
        tokenHost: defaultHost,
        tokenPath: '/oauth/token',
        authorizePath: '/oauth/authorize'
    }
});



// Get the access token object for the client
router.get('/', (req, res) => {

    const tokenConfig = {
        scope: 'read admin'
    };
    oauth2.clientCredentials
        .getToken(tokenConfig)
        .then((result) => {
            const accessToken = oauth2.accessToken.create(result);
            return res
                .status(200)
                .json(accessToken);
        })
        .catch((error) => {
            console.log('Access Token error', error.message);
            return res.status(500)
                .json(error);
        });

});


module.exports = router;


