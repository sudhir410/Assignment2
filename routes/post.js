const express=require('express');
const router=express.Router();
const Post=require('../model/post')
const bodyparser=require('body-parser');
const { route } = require('./login');

router.use(bodyparser.json())

router.get("/",async (req,res)=>{
    try{
        const posts=await Post.find()
        res.status(200).json(posts)
    }catch(e){
        res.status(400).json({
            status:"failed",
            message:e.message
        })
    }
})

router.post('/',async(req,res)=>{
    try{
        const {title,body,image}=req.body
        const data=await Post.create({
            title,
            body,
            image,
            user:req.user
        })
        res.status(200).json({
            status:"Post Created",
            data
        })

    }catch(e){
        res.status(400).json({
            status:"failed",
            message:e.message
        })
    }
})

router.put('/:id',async(req,res)=>{
    try{        
        const postval=await Post.findOne({_id:req.params.id})
        if(postval){

        const post=await Post.findOne({$and:[{_id:req.params.id},{user:req.user}]})
        if(post){
            await Post.updateOne({_id:req.params.id},req.body)
            res.status(200).json({
                status:"Success"
            })
        }
        else{
            res.status(400).json({status:"failed",message:"can not update others post"})
        }
    }else{
        res.status(400).json({
            status:"failed",
            message:"no post found"
        })
    }
    }catch(e){
        res.status(400).json({
            status:"failed",
            messagee:e.message
        })
    }
})


router.delete('/:id',async(req,res)=>{
    try{        
        const postval=await Post.findOne({_id:req.params.id})
        if(postval){

        const post=await Post.findOne({$and:[{_id:req.params.id},{user:req.user}]})
        if(post){
            await Post.deleteOne({_id:req.params.id})
            res.status(200).json({
                status:"Successfully deleted"
            })
        }
        else{
            res.status(400).json({status:"failed",message:"can not delete others post"})
        }
    }else{
        res.status(400).json({
            status:"failed",
            message:"no post found"
        })
    }
    }catch(e){
        res.status(400).json({
            status:"failed",
            messagee:e.message
        })
    }
})
module.exports=router;