const { blogs } = require("../model")

exports.renderEditBlog = async (req,res)=>{
    // res.render("editBlog")
    // find the blog with coming id 
    const id = req.params.id 
    const blog= await blogs.findAll({
        where :{
            id:id
        }
    })
    res.render("editBlog.ejs",{blog:blog})
}


exports.editBlog = async(req,res)=>{

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

    res.redirect("/blogs/"+id)
}

exports.addBlog =  async(req,res)=>{  
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

}

exports.deleteblog =async (req,res)=>{
    const id = req.params.id;
    // aako id ko data(row) chae blogs vanney table bata delete garnu paryo 
    await blogs.destroy({
        where:{
            id:id
        }
    })
    res.redirect("/");
}

exports.singleBlog =async  (req,res)=>{
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
}