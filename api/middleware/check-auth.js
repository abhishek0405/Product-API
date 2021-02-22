const jwt = require('jsonwebtoken');
module.exports = (res,resp,next)=>{
    try{
    const decoded = jwt.verify(req.body.token,process.env.JWT_KEY);
    req.userData = decoded;//created new field
    next();
    } catch(error){
        return res.status(401).json({
            message:"not authenticated"
        })
    }

}