const express=require('express');
const router=express.Router();
const bodyparser=require('body-parser');
const User=require('../model/user');
const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken");
const {body, validationResult}=require('express-validator');
const secret="Assignment"

router.use(bodyparser.json());

router.post('/register',body("email").isEmail(),async (req,res)=>{
    try{
        const error=validationResult(req)
        if(!error.isEmpty()){
            res.status(400).json({message:error.array()})
        }

        const {name,email,password}=req.body
        const emailval=await User.findOne({email:email})
        
        if(!emailval){
        bcrypt.hash(password,10,async (err,hash)=>{
            if(err){
               return res.status(400).json({
                    status:"failed",
                    message:err.message
                })
            }
            const data=await User.create({
                name:name,
                email:email,
                password:hash
            })
            res.status(200).json({
                status:"success",
                data
            })
        })
    }else{
        res.status(400).json({
            status:"failed",
            message:"Already registered"
        })
    }
    }catch(e){
        res.json({
            status:"failed",
            message:e.message
        })
    }
})

router.post('/login',body('email').isEmail(),async(req,res)=>{
    try{
        const error=validationResult(req)
        if(!error.isEmpty()){
            res.status(400).json({message:error.array()})
        }
        const{email,password}=req.body;

        const user=await User.findOne({email:email})
        if(!user){
            return res.status(400).json({
                status:"failed",
                message:"User Not Registered"
            })
        }
        bcrypt.compare(password,user.password,(err,result)=>{
            if(err){
               return res.status(400).json({
                status:"failed",
                message:err.message
               })
            }
            if(result){
                const token=jwt.sign({
                    exp:Math.floor(Date.now()/1000)+(60*120),
                    data:user._id
                },secret);

                res.status(200).json({
                    status:"Success",
                    token
                })
            }else{
                res.status(400).json({
                    status:"failed",
                    message:"wrong password"
                })
            }
        })
    }catch(e){
       res.status(400).json({
        status:"failed",
        message:e.message
       })
    }
})

module.exports=router;