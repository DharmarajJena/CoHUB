
const admin=require('./auth-config/firebase-config');
class Middleware{
    
    verifyFirebaseToken=async(req,res,next)=>{

        const authorization=req.headers.authorization
        if(!authorization)
            return res.status(401).json({error:'Token not found'});
        const token=req.headers.authorization.split(' ')[1];
        if(!token)
            return res.status(401).json({error:'Unauthorized'});

        try {
            const decodedValue=await admin.auth().verifyIdToken(token);
            req.firebaseUser=decodedValue;
            console.log(decodedValue);
            if(decodedValue){
                return next();
            }
        }catch (error) {
            console.error(error);
            return res.status(401).json({error:'Invalid token'});
        }
    }

    logRequest=(req,res,next)=>{
        console.log(`[${new Date().toLocaleString()}] Request made to: ${req.originalUrl}`);
        next();
    }
}

module.exports= new Middleware();