const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const requiedLogin=require('../middleware/requireLogin')

//USe for token

const jwt = require('jsonwebtoken');
const {JWT_SECRET}=require('../keys')
/**
 * Acquire the mongoose
 */

const User = mongoose.model("User")


router.get('/protected',requiedLogin,(req,res)=>{
    res.send("Hello User")
})


router.get('/', (req, res) => {
    res.send("Hello")
})

router.post('/signup', (req, res) => {
    const { name, email, password,pic } = req.body
    if (!email || !name || !password) {
        return res.status(422).json({ error: "Please add all the fields" })
    }

    User.findOne({ email: email })
        .then((saveUser) => {

            if (saveUser) {
                return res.status(422).json({ error: "User already exists what that mail" })
            }
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email,
                        password: hashedPassword,
                        name,
                        pic
                    })
                    user.save()
                        .then(user => {
                            res.json({ message: "User saved successfully" })
                        })
                        .catch(err => {
                            console.log(err);
                        })
                })

        }).catch(err => {
            console.log(err);
        })



})

router.post('/signin', (req, res) => {

    const { email, password } = req.body
    if (!email || !password) {
        res.status(422).json({ error: "Please Provide email or password" })
    }
    /**
     * Find if user is present in the User Model
     */
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid Email or Password" })
            }
            bcrypt.compare(password,savedUser.password)
            .then(doMatch=>{
                if(doMatch)
                {
                    /**
                     * User sussesfully signIn
                     */
                    //res.json({message:"User successfull signIn"})

                    const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
                    const {_id,email,name,followers,following,pic}=savedUser
                    res.json({token,user:{_id,name,email,followers,following,pic}})
                }
                else
                {
                    return res.status(422).json({error:"Invalid Email or Password"})
                }
            })

        })
})

module.exports = router