const mongoose=require('mongoose');

const postSchema=new mongoose.Schema({
    title:{type:String,required:true},
    body:{type:String,required:true},
    image:{type:String,require:true},
    user:{type:mongoose.Schema.Types.ObjectId,ref:"user"}
})

const postModel=mongoose.model("post",postSchema)

module.exports=postModel;