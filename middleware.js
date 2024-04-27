const admin = require('./auth-config/firebase-config');

class Middleware {
    
    async refreshToken(oldToken,res) {
        try {
            // Exchange the old token for a new one
            const decodedToken = await admin.auth().verifyIdToken(oldToken);
            const uid = decodedToken.uid;
            const newToken = await admin.auth().createCustomToken(uid);
            console.log(newToken);
            res.cookie('token', newToken, { httpOnly: true });
            return newToken;
        } catch (error) {
            throw new Error("Error refreshing token: " + error.message);
        }
    }

    verifyFirebaseToken = async (req, res, next) => {
        const authorization = req.headers.authorization;
        if (!authorization)
            return res.status(401).json({error: 'Token not found'});
        const token = authorization.split(' ')[1];
        if (!token)
            return res.status(401).json({error: 'Unauthorized'});

        try {
            const decodedValue = await admin.auth().verifyIdToken(token);
            // console.log(decodedValue);
            console.log(1);
            
            // Check if the token will expire within the next 5 minutes
            // if (decodedValue.exp - Date.now() / 1000 < 300) {
                const newToken = await this.refreshToken(token,res);
                // Set the new token in response headers
                res.set("Authorization", `Bearer ${newToken}`);
            // }
            
            req.firebaseUser = decodedValue;

            return next();
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/argument-error') {
                // Token has expired, attempt to refresh it
                try {
                    const decodedValue = await admin.auth().verifySessionCookie(token, true);
                    // Set the new token in response headers
                    // res.set("Authorization", `Bearer ${newToken}`);
                    // Proceed with the request using the new token
                    // const decodedValue = await admin.auth().verifyIdToken(newToken);
                    req.firebaseUser = decodedValue;
                    return next();
                } catch (refreshError) {
                    console.error("Error refreshing token:", refreshError);
                    return res.status(401).json({error: 'Error refreshing token'});
                }
            } else {
                // Other authentication errors
                return res.status(401).json({error: 'Invalid token'});
            }
        }
    }

    logRequest = (req, res, next) => {
        console.log(`[${new Date().toLocaleString()}] Request made to: ${req.originalUrl}`);
        next();
    }
}

module.exports = new Middleware();
