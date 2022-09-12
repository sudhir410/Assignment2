const express=require("express");
const jwt = require("jsonwebtoken");
const app=express()
const mongoose=require('mongoose') 
const User=require("./model/user")
const port=3000;
mongoose.connect('mongodb://localhost/assignment')
const login=require('./routes/login');
const post=require('./routes/post');
const secret="Assignment"


app.use('/post',(req,res,next)=>{
    if(req.headers.authorization){
    const token=req.headers.authorization.split("test ")[1];
        jwt.verify(token,secret,async (err,decode)=>{
            if(err){
              return   res.status(400).json({
                    status:"failed",
                    message:err.message
                })
            }

            const user=await User.findOne({_id:decode.data})
            req.user=user._id
            next()

        })
    }else{
        res.status(400).json({status:"failed",message:"token not found"})
    }

})


app.use('/post',post)
app.use('/',login)


app.listen(port,()=>console.log('server started at port '+port))