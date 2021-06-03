const express =require('express')
const app=express()
const PORT=5000
const {MONOGOURI}=require('./keys')

//getting User Schema 
const mongoose=require('mongoose')
mongoose.connect(MONOGOURI, {useNewUrlParser: true,useUnifiedTopology: true} )
mongoose.connection.on('connected',()=>{
    console.log("Connected to Mongo");
})
mongoose.connection.on('error',(err)=>{
    console.log("Err in Connecting",err);
})


require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

/** 
* 
* next() function is used for the out form the middleware

const customMiddleWare=(req,res,next)=>{
    console.log("Called MiddleWare");
    next()
}

 * it can be call for all the route app.use(middlewareName) 
 * it is code which is call before the router  
 * it modify the request before the go to router 
 

app.get('/',(req,res)=>{
    console.log("home");
    res.send("Hellow world")
})
/**
 * To use the midleware for the specific route we use the middleware here
 * in second parameter
 *
 
app.get('/about',customMiddleWare,(req,res)=>{
    res.send("About page")
})
*/





app.listen(PORT,()=>{
    console.log("Server is running on", PORT);
})