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

const fs = require("fs");

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
    imageUrl : process.env.BACKEND_URL + req.file.filename
   })
//    res.send("BLog created successfully")
   res.redirect("/")

})
//edit blog form
app.get("/edit/:id",async(req,res)=>{
    // res.render("editBlog")
    // find the blog with coming id 
    const id = req.params.id 
    const blog= await blogs.findAll({
        where :{
            id:id
        }
    })
    res.render("editBlog.ejs",{blog:blog})
})


// edit form bata aako data handle 
app.post("/edit/:id", upload.single('image'),async(req,res)=>{

    const id = req.params.id;
    const { title, subTitle, description} = req.body;
    let fileName 
    if(req.file){
        fileName = req.file.fieldname
    }

    // fs file system package, unlink method ho 
    // fs.unlink("./uploads/test.txt",(err)=>{
    //     if(err){


    //     }else{
    //         console.log("File delet succefully");
    //     }
    // })
    
    //old data
    const oldData = await blogs.findAll({
        where:{
            id:id
        }
    })
    const oldFileName = oldData[0].imageUrl
    // console.log(oldFileName)
    const lengthToCut = "http://localhost:3000/".length
    // console.log(lengthToCut)

    const oldFileNameAfterCut = oldFileName.slice(lengthToCut);
    // console.log(oldFileNameAfterCut)
    
    // return
    

    if(fileName){
        //delete old beacuase naya aairako xa
        fs.unlink("./uploads/" + oldFileNameAfterCut,(err)=>{
            if(err){
                console.log("error occured", err)
            }else{
                console.log("old file delete successfully");
            }
        })
    }

    // to keep in dbms 
    await blogs.update({
        title:title,
        subTitle:subTitle,
        description:description,
        imageUrl : fileName ? process.env.BACKEND_URL + fileName : oldFileName
    },{
        where:{
            id:id
        }
    })

    res.redirect("/blog/"+id)
})

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


// get all Blogs 


app.use(express.static("./uploads/"))

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