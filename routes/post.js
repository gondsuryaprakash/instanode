const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post")

const requiedLogin = require('../middleware/requireLogin')
const { route } = require('./auth')

router.get('/allpost', requiedLogin, (req, res) => {

    Post.find()
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err);
        })
})
router.get('/subpost', requiedLogin, (req, res) => {

    Post.find({postedBy:{$in:req.user.following}})
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err);
        })
})

router.post('/createpost', requiedLogin, (req, res) => {
    const { title, body, photo } = req.body
    if (!title || !body || !photo) {
        res.status(422).json({ error: "Please add all the field" })
    }

    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo,
        postedBy: req.user
    })

    post.save()
        .then(result => {
            res.json({ post: result })
        })
        .catch(err => {
            console.log(err);
        })





})

router.get('/mypost', requiedLogin, (req, res) => {
    console.log(req.user._id);
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .then(mypost => {
            res.json({ mypost })
        })
        .catch(err => {
            console.log(err);
        })
})



router.put('/like', requiedLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    },
        { new: true })
        .exec((err, result) => {
            if (err) {
                res.status(402).json({ error: err })
            }
            else {
                res.json(result)
            }
        })
})

router.put('/unlike', requiedLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    },
        { new: true })
        .exec((err, result) => {
            if (err) {
                res.status(402).json({ error: err })
            }
            else {
                res.json(result)
            }
        })
})

router.put('/comment', requiedLogin, (req, res) => {
    const comment={
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments:comment}
    },
        { new: true })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                res.status(402).json({ error: err })
            }
            else {
                res.json(result)
            }
        })
       
})


router.delete('/deletepost/:postedId',requiedLogin,(req,res)=>{

    Post.findOne({_id:req.params.postedId})
    .populate("postedBy","_id")
    .exec((err,post)=>
    {
        if(err || !post)
        {return res.status(422).json({error:err})}

        if(post.postedBy._id.toString()==req.user._id.toString())
        {
            post.remove()
            .then(result=>{
                res.json(result)
            })
            .catch(err=>console.log(err))
        }
    })
})

router.delete('/deletecomment/:postId',requiedLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .then(res=>{res.json()})
    .then(data=>{console.log(data);
    
        return res.json(data)
    })
})

module.exports = router