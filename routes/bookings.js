'use strict';

const express = require('express');
const router = express.Router();

const simpleOauthModule = require('simple-oauth2');
const rp = require('request-promise');
const config = require('./config');

const oauth2 = simpleOauthModule.create({
    client: {
        id: 'elite2apiclient',
        secret: 'clientsecret'
    },
    auth: {
        tokenHost: config.defaultHost,
        tokenPath: '/oauth/token',
        authorizePath: '/oauth/authorize'
    }
});

/* GET password token. */
router.get('/', (req, res) => {

    // Get the access token object.
    const tokenConfig = {
        username: 'KAREN',
        password: 'password123456'
    };

    // Save the access token
    oauth2.ownerPassword
        .getToken(tokenConfig)
        .then((result) => {
            const accessToken = oauth2.accessToken.create(result);
            const options = {
                uri: `${config.defaultHost}/api/bookings`,
                headers: {
                    'Authorization' : 'Bearer ' + accessToken.token.access_token,
                    'Page-Limit': '2000'
                },
                json: true
            };

            rp(options)
                .then(function (repos) {
                    return res
                        .status(200)
                        .json(repos);
                })
                .catch(function (err) {
                    return res.status(500)
                        .json(err);
                });
        })
        .catch((err) => {
            return res.status(500)
                .json(err);
        })

});

module.exports = router;


