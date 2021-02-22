const express = require('express')
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
router.post("/signup",(req,res,next)=>{ 
    User.find({email:req.body.email})
        .exec()
        .then(user=>{
            if(user.length>=1){
                return res.status(409).json({
                    message:"User aldready exists!!!"
                })
            } else{
                bcrypt.hash(req.body.password,10,(err,hash)=>{
                    if(err){
                        console.log(err);
                        return res.status(500).json({
                            message:'Error while hashing'
                        })
                    } else{
                        const user = new User({
                            name: req.body.name,
                            email:req.body.email,
                            password:hash
                        })
                        user.save()
                            .then(user=>{
                                console.log(user);
                                res.status(201).json({
                                    message:'USER CREATED'
                                })
                            })
                            .catch(err=>{
                                console.log(err);
                                res.status(500).json({
                                    message:"error while creating user"
                                })
                            })
            }
        })
    
        }
    })
})

router.post("/login",(req,res,next)=>{
    console.log(process.env.JWT_KEY);   
    console.log(req.ip);
     User.find({email:req.body.email})
         .exec()
         .then(foundUser=>{
             if(foundUser.length==0){
                 console.log("mail does not exist");
                 return res.status(404).json({
                     message:"auth failed"
                 })
             } else{
                 bcrypt.compare(req.body.password,foundUser[0].password,(err,result)=>{
                     if(err){
                         console.log("error while hashing");
                         return res.status(404).json({
                            message:"auth failed"
                        })
                     } 
                     if(result){//result true if matches else false
                        console.log("Succesful login");
                        const token = jwt.sign({
                            email:foundUser[0].email,
                            id:foundUser[0]._id
                        },process.env.JWT_KEY,{
                            expiresIn:"1h"
                        });
                         return res.status(200).json({
                             message:"auth succesful",
                             token:token
                         })
                     } else{
                         console.log("password does not match");
                         return res.status(404).json({
                            message:"auth failed"
                        })
                     }
                 })
             }
         })
         .catch()
})

router.delete('/:userId',(req,res,next)=>{
    console.log(req.params.userId);
    User.findById(req.params.userId)
        .exec()
        .then(foundUser=>{
            console.log(foundUser);
            if(foundUser){
                User.remove({_id:req.params.userId})
                    .exec()
                    .then(result=>{
                        console.log(result);
                        console.log("user deleted");
                        res.status(200).json({
                        message:"deleted user succesfully"
                    });
                })
                    .catch(err=>{
                        console.log("err while deleting user");
                        console.log(err);
                        res.status(500).json({
                        error:err
                    })
                })
            } else{
                res.status(409).json("error while finding");
            }
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json("error ")
        });
    });
    


module.exports = router