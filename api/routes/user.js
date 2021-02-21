const express = require('express')
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
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