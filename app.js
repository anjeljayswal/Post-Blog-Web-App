const express = require("express")
const { blogs } = require("./model/index.js")
// requiring multerConfig
const {multer,storage} = require("./middleware/multerConfig.js")
const upload = multer({storage : storage})
// const multer = require("./middleware/multerConfig.js").multer
// const storage = require("./middleware/multerConfig.js").storage


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
app.get("/blogs/:id",async  (req,res)=>{
    // console.log(req.params.id)
    const id = req.params.id;
    // const {id} = req.params; //alternative of avobe called object destructuring

    // aako od ko dat blogs table fetch/find garnu paryo
    const blog = await blogs.findAll({
        where:{
            id: id
    }})
    // console.log("Hello i am 2");

    // const blog = await blogs.findByPk(id);
    
    // console.log(blog);
    // res.send("Id ${2} came")
    res.render("singleBlog.ejs",{blog:blog})
})


//delete blog
app.get("/delete/:id", async (req,res)=>{
    const id = req.params.id;
    // aako id ko data(row) chae blogs vanney table bata delete garnu paryo 
    await blogs.destroy({
        where:{
            id:id
        }
    })
    res.redirect("/");
})

app.get("/addBlog",(req,res)=>{
    res.render("addBlog")
})

// api for handling formdata
app.post("/addBlog",upload.single('image'), async(req,res)=>{

  
    // const title = req.body.title
    // const subTitle = req.body.subTitle
//    ALTERNATIVE 
    const {title,subTitle,description} = req.body 

  await blogs.create({
    title , 
    subTitle  ,
    description ,
    imageUrl : req.file.filename
   })
//    res.send("BLog created successfully")
   res.redirect("/")

})

// get all Blogs 


app.use(express.static("./uploads/"))

const PORT  = process.env.PORT

app.listen(PORT,()=>{
    console.log("Node js project has started at port " + PORT)
})