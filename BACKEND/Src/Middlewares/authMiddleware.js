const jwt=require('jsonwebtoken');

const verifyToken=(req,res,next)=>{
     let token;
     let authHeader=req.headers.authorization || req.headers.Authorization;
    
        if(authHeader && authHeader.startsWith('Bearer')){
            token=authHeader.split(' ')[1];

            if(!token){
                return res.status(401).json({
                    success:false,
                    message:'Access token not found'
                });
            }

            try{
                const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
                req.user=decoded;
                console.log("Decoded user is a : ",req.user);
                next();
            }catch(err){
                return res.status(403).json({
                    success:false,
                    message:'Invalid token'
                });
            }
        }
}

module.exports=verifyToken;