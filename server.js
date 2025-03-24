const express = require('express');
const axios = require('axios');
const app = express();

const clientId = 'Ov23liKPq4OqWefDiy2P';
const clientSecret = 'c702fc85e3c046532d84cc746896abed8b38ed0a';
const redirectUri = 'https://gameholder.site/callback/';

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    
    if (!code) {
        return res.status(400).send('Authorization code not provided');
    }

    try {
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            redirect_uri: redirectUri
        }, {
            headers: {
                'Accept': 'application/json'
            }
        });

        const accessToken = tokenResponse.data.access_token;

        if (!accessToken) {
            return res.status(400).send('Access token not provided');
        }

        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const user = userResponse.data;
        // database will be added here later.
        

        // redirection to the "gameholder.site/lobby" after login.
        res.redirect('https://gameholder.site/lobby');
    } catch (error) {
        console.error('Error during OAuth process:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
