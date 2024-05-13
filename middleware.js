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
        try{
            const decodedValue = await admin.auth().verifyIdToken(token);
            // console.log(decodedValue);
            
            req.firebaseUser = decodedValue;

            return next();
        }catch (error) {
            console.error(error);
            return res.status(401).json({error: 'Invalid token'});
        }
    }

    logRequest = (req, res, next) => {
        console.log(`[${new Date().toLocaleString()}] Request made to: ${req.originalUrl}`);
        next();
    }
}

module.exports = new Middleware();
