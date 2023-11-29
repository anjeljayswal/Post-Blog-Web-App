const { users } = require("../model");
const bcrypt = require("bcrypt");
exports.registerUser =async (req,res)=>{
    const {username, email, password} =req.body;
    await users.create({ //users from model
        email,
        username,
        password: bcrypt.hashSync(password, 10), //here 10 is saas value means how deep we want to hash pur password
    })
    res.send("User registered Successfulyy")
}

exports.loginUser = async (req,res)=>{
    //access email and password
    const { email, password} = req.body;
    if(!email || !password){
        return res.send("Please provide email and password");
    }
    //check if email exits or not
    const user = await users.findAll({
        where:{
            email:email
        }
    })
    if(user.length == 0){
        res.send("User does not exist with this email")
    }else{
        //check passord matches or not
        const ispasswordMatched = bcrypt.compareSync(password, user[0].password)
        if(ispasswordMatched){
            res.send("Logged in successfully")
        }else{
            res.send("Invalid password")
        }
    }

} 