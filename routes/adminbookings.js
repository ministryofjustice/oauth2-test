'use strict';

const express = require('express');
const router = express.Router();

const simpleOauthModule = require('simple-oauth2');
const rp = require('request-promise');

const defaultHost = 'http://localhost:3000/api';

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


/* GET password token. */
router.get('/', (req, res) => {

    const tokenConfig = {
        scope: 'read admin'
    };
    oauth2.clientCredentials
        .getToken(tokenConfig)
        .then((result) => {
            const accessToken = oauth2.accessToken.create(result);
            const options = {
                uri: `${defaultHost}/api/prisoners?lastName=SMITH`,
                headers: {
                    'Authorization' : 'Bearer ' + accessToken.token.access_token,
                    'Page-Limit': '2000'
                },
                json: true // Automatically parses the JSON string in the response
            };

            rp(options)
                .then(function (repos) {
                    return res
                        .status(200)
                        .json(repos);
                })
                .catch(function (err) {
                    return res.status(500)
                        .statusMessage(err.message);
                });
        })
        .catch((error) => {
            console.log('Access Token error', error.message);
            return res.status(500)
                .json(error.message);
        });

});

module.exports = router;


