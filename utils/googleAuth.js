// auto refresh of google tokens 

const { google } = require('googleapis');
const Token = require('../models/tokens');

async function getGoogleClient(userId) {
    const tokenData = await Token.findOne({ userId });
    if (!tokenData) return null;

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALLBACK_URL
    );

    oauth2Client.setCredentials({
        access_token: tokenData.accessTok,
        refresh_token: tokenData.refreshTok,
        expiry_date: tokenData.expiryDate
    });

    oauth2Client.on('tokens', async (tokens) => {
        const update = { accessTok: tokens.access_token };
        if (tokens.expiry_date) update.expiryDate = tokens.expiry_date;
        if (tokens.refresh_token) update.refreshTok = tokens.refresh_token;

        await Token.findOneAndUpdate({ userId }, update);
        console.log("DB updated with fresh tokens.");
    });

    // If it expires in < 5 mins, refresh now
    const buffer = 300000; // 5 minutes in ms
    if (tokenData.expiresAfter && (Date.now() + buffer) > tokenData.expiresAfter.getTime()) {
        try {
            const { credentials } = await oauth2Client.refreshAccessToken();
            oauth2Client.setCredentials(credentials);
        } catch (err) {
            console.error("Manual refresh failed:", err);
            return null;
        }
    }

    return oauth2Client;
}

module.exports = getGoogleClient;