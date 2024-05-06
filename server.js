const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require("bcrypt");
const path = require('path')
const port = 5000
const app = express();

app.use(express.static(__dirname))
app.use(express.urlencoded({extended:true}))

mongoose.connect('mongodb://127.0.0.1:27017/lostandfound')
const db = mongoose.connection
db.once('open',()=>{
    console.log("Mongodb connection successful")
})

//Definition of Schemas - Start

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String
})

const lostSchema = new mongoose.Schema({
    lostitem : String,
    lostCategory : String,
    lostbrand : String,
    lostdesc : String,
    lostPricolor : String,
    lostSeccolor : String,
    lostdate : Date,
    losttime : String,
    lostUfirname : String,
    lostUlastname : String,
    lostphone : String,
    lostEmailid : String,
})

const foundSchema = new mongoose.Schema({
    founditems : String,
    foundCategory : String,
    foundbrand : String,
    founddesc : String,
    foundPricolor : String,
    foundSeccolor : String,
    founddate : Date,
    foundtime : String,
    foundUfirname : String,
    foundUlastname : String,
    foundphone : String,
    foundEmailid : String,
})

//Definition of Schemas - End

//Constants Created for Schemas
const Users = mongoose.model("data",userSchema)
const LostUsers = mongoose.model('Lostdata',lostSchema)
const FoundUsers = mongoose.model('Founddata',foundSchema)


//Page Redirection - starts

app.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname,'signup.html'))
})
 
app.get('/home',(req,res)=>{
    res.sendFile(path.join(__dirname,'home.html'))
})

app.get("/login", (req,res) => {
    res.render("login.html");
});

app.get('/found',(req,res)=>{
    res.sendFile(path.join(__dirname,'found.html'))
})

app.get('/lost',(req,res)=>{
    res.sendFile(path.join(__dirname,'lost.html'))
})
//Page redirection - ends

///////////// Signup ////////////////
app.post('/post',async (req,res)=>{
    const {name,email,password} = req.body
    const user = new Users({
        name,
        email,
        password
    })

    const existingUser = await Users.findOne({email: user.email});

    if(existingUser){
        res.send("Email already registered")
        
    }else{
        //Hashing the password for security (bcrypt)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds)

        user.password = hashedPassword; //Replacing with hashed password

        await user.save()
        console.log(user)
        res.sendFile(path.join(__dirname,'home.html'))
        
    }

})

////////////// Login ///////////////
app.post("/login", async(req,res) =>{
    try{
        const check = await Users.findOne({email: req.body.email});
        if(!check){
            res.send("Email is not registered");
        }

        //Comparing the entered password with the hashedpassword
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if(isPasswordMatch){
            res.sendFile(path.join(__dirname,'home.html'))
        }else{
            res.send("Incorrect Password");
        }
    }catch{
        res.send("Uhm....")
    }
})

app.post("/tofound", async(req,res) =>{
    res.sendFile(path.join(__dirname,'found.html'))
})

app.post("/tolost", async(req,res) =>{
    res.sendFile(path.join(__dirname,'lost.html'))
})
///////////// Login ends  /////////////////


/////////// Lost page ///////////////////
app.post('/lost',async (req,res)=>{
    const {lostitem,lostCategory,lostbrand,lostdesc,lostPricolor,lostSeccolor,lostdate,losttime,lostUfirname,lostUlastname,lostphone,lostEmailid} = req.body
    const losts = new LostUsers ({
        lostitem,
        lostCategory,
        lostbrand,
        lostdesc,
        lostPricolor,
        lostSeccolor,
        lostdate,
        losttime,
        lostUfirname,
        lostUlastname,
        lostphone,
        lostEmailid
    })

    try {
        // Save the lost item data to the database
        await losts.save();
        console.log("Lost item data saved successfully:", losts);
        res.send("Lost item data saved successfully");
    } catch (error) {
        console.error("Error saving lost item data:", error);
        res.status(500).send("Error saving lost item data");
    }
})


/////////// Found page ///////////////////
app.post('/found',async (req,res)=>{
    const {founditems ,foundCategory ,foundbrand ,founddesc ,foundPricolor ,foundSeccolor ,founddate ,foundtime ,foundUfirname ,foundUlastname ,foundphone ,foundEmailid } = req.body
    const founds = new FoundUsers ({
        founditems ,
        foundCategory ,
        foundbrand ,
        founddesc ,
        foundPricolor ,
        foundSeccolor ,
        founddate ,
        foundtime ,
        foundUfirname ,
        foundUlastname ,
        foundphone ,
        foundEmailid 
    })

    try {
        // Save the found item data to the database
        await founds.save();
        console.log("Found item data saved successfully:", founds);
        res.send("Found item data saved successfully");
    } catch (error) {
        console.error("Error saving found item data:", error);
        res.status(500).send("Error saving found item data");
    }
    
    
})

//Debugging
app.listen(port, ()=>{
    console.log("Server started")
})