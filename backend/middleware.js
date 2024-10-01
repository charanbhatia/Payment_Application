const {JWT_SECRET} = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) =>{
    const autheader = req.headers.authorization;
    
    if(!autheader || !autheader.startWith('Bearer')){
        return res.status(403).json({})
    }

    const token = autheader.split('')[1];

    try{
        const decoaded = jwt.verify(token, JWT_SECRET);

        req.userId = decoaded.userId;

        next();
    }
    catch(err){
        return res.status(403).json({});
    }
};

module.exports = {
    authMiddleware
}