'use strict';

const express = require('express');
const router = express.Router();

const simpleOauthModule = require('simple-oauth2');

const defaultHost = 'http://localhost:8080';

const oauth2 = simpleOauthModule.create({
    client: {
        id: 'elite2apiclient',
        secret: 'clientsecret'
    },
    auth: {
        tokenHost: defaultHost,
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
            return res
                .status(200)
                .json(accessToken);
        })
        .catch((err) => {
            return res.status(500)
                .json(err);
        })

});


module.exports = router;


