const jwt = require('jsonwebtoken');
const {JWT_SECRET}=require("../keys")
const mongoose=require('mongoose')
const User=mongoose.model('User')

module.exports=(req,res,next)=>{
    const {authorization}=req.headers
    if(!authorization)
    {
        res.status(401).json({error:"You must be logged In "})
    }
    //const token=authorization.replace("Bearer"," ")
    const token =authorization.split(" ")[1]
    jwt.verify(token,JWT_SECRET,(err,payLoad)=>{
        if(err)
        {
            console.log(err);
            return res.status(401).json({error:"You must be logged In"})
        }
        const {_id}=payLoad
        User.findById(_id)
        .then(userData=>{
            req.user=userData
            console.log(userData);
            next()
        })
        
    })
}