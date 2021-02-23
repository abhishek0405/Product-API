const jwt = require('jsonwebtoken');
module.exports = (req,resp,next)=>{
    try{
    const token = (req.headers.authorization).split(" ")[1];
    console.log(token);
    const decoded = jwt.verify(token,process.env.JWT_KEY);//stores the token and verifies if same
    req.userData = decoded;//created new field use thhis to check if admin or Not.
    console.log(req.userData);
    next();
    } catch(error){
        return resp.status(401).json({
            message:"not authenticated"
        })
    }

}