const express = require("express")
const { blogs } = require("./model/index.js")
const { posts, users } = require("./model/index.js");
// const {users}=require("./middleware/index.js")
// requiring multerConfig
const {multer,storage} = require("./middleware/multerConfig.js")
const upload = multer({storage : storage})
// const multer = require("./middleware/multerConfig.js").multer
// const storage = require("./middleware/multerConfig.js").storage

const bcrypt = require("bcrypt");

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = require("jquery")(window);

const app = express()
// telling nodejs to require and use .env
 require("dotenv").config()

require("./model/index.js")
// say nodejs that we are using ejs, set everything
app.set("view engine","ejs")

const fs = require("fs");
const { renderEditBlog, editBlog, addBlog, deleteblog, singleBlog } = require("./controller/blogController.js");
const { registerUser, loginUser } = require("./controller/authController.js");

// telling nodejs to accept the incoming data(parsing data)
app.use(express.json()) // cT = application/json handle
app.use(express.urlencoded({extended : true})) // cT = application/x-www-form-urlencoded


app.get("/",async(req,res)=>{
    const allBlogs = await blogs.findAll()
 
    res.render("allBlogs.ejs",{blogs : allBlogs})
})

// get single blogs 
// app.get("/2",(req,res)=>{
//     res.send("Id 2 came")
// })
app.get("/blogs/:id",singleBlog)


//delete blog
app.get("/delete/:id", deleteblog)

// add blog 
app.get("/addBlog",(req,res)=>{
    res.render("addBlog")
})

// api for handling formdata
app.post("/addBlog",upload.single('image'),addBlog)
//edit blog form
app.get("/edit/:id",renderEditBlog)


// edit form bata aako data handle 
app.post("/edit/:id",upload.single('image'), editBlog)

// //edit form bata aako data handle
// app.post("/edit/:id",(res,req)=>{
//     console.log(req.body)
// })


// Function to format a date string
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}

// Make the function available to your EJS templates
app.locals.formatDate = formatDate;

// Serve static files (including CKEditor) from the public directory
app.use(express.static('public'));


// add post 
app.get("/adminc",(req,res)=>{
    res.render("adminCreate")
})

// api for handling formdata
app.post("/adminc",upload.single('image'), async(req,res)=>{   
    const {title,bodys} = req.body
    const selectedTopics = req.body.topic; 
    try {
        const newPost = await posts.create({
            title,
            body:bodys,

            topic:selectedTopics,
            imageUrl: process.env.BACKEND_URL + req.file.filename,
        });

        // console.log("Blog created successfully:", newPost);
        // res.send("Blog created successfully");
        res.redirect("/");
    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).send("Internal Server Error");
    }
//    res.send("BLog created successfully")
   //    res.r/edirect("/")

})


// get all Blogs 

//resister
app.get("/register",(req,res)=>{
    res.render("registerUser")
})
app.post("/register",registerUser )

//login user
app.get("/login",(req,res)=>{
    res.render("userLogin")
})
app.post("/login", loginUser)

// app.get("/admini",(req,res)=>{
//     res.render("adminIndex.ejs")
// })

// app.get("/topici",(req,res)=>{
//     res.render("topicsIndex")
// })
// app.get("/topicc",(req,res)=>{
//     res.render("topicCreate")
// })
// app.get("/usersc",(req,res)=>{
//     res.render("usersCreate")
// })
// app.get("/usersi",(req,res)=>{
//     res.render("usersIndex")
// })


app.use(express.static("./uploads/"))
app.use(express.static("./public/"))

const PORT  = process.env.PORT

app.listen(PORT,()=>{
    console.log("Node js project has started at port " + PORT)
})






// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/anjeljayswal/Post-Blog-Web-App.git
// git push -u origin main