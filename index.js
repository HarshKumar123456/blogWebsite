import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

async function connectToDatabase() {
  await mongoose.connect('mongodb://127.0.0.1:27017/blogWebsiteDB');
}

await connectToDatabase();

const schoolBlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const collegeBlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const schoolBlogModel = mongoose.model("SchoolBlog", schoolBlogSchema);
const collegeBlogModel = mongoose.model("CollegeBlog", collegeBlogSchema);


async function createNewSchoolBlog(blogTitle, blogContent) {
    const blog = new schoolBlogModel({
        title: blogTitle,
        content: blogContent
    });
    await blog.save();
}

async function createNewCollegeBlog(blogTitle, blogContent) {
    const blog = new collegeBlogModel({
        title: blogTitle,
        content: blogContent
    });
    await blog.save();
}


async function findSchoolBlogs() {
  const blogs = await schoolBlogModel.find();
  return blogs;
}

async function findCollegeBlogs() {
    const blogs = await collegeBlogModel.find();
    return blogs;
  }

  var blogList = [];


app.get("/" , async (req,res) => {
    const type = "College";
    blogList = await findCollegeBlogs();
    res.render("index.ejs",{typeOfBlogs: type,blogs: blogList});
});

app.get("/School" , async (req,res) => {
    const type = "School";
    blogList = await findSchoolBlogs();
     res.render("index.ejs",{typeOfBlogs: type,blogs: blogList});
});

app.get("/College" , async (req,res) => {
    const type = "College";
    blogList = await findCollegeBlogs();
     res.render("index.ejs",{typeOfBlogs: type,blogs: blogList});
});

app.post("/newBlog", (req,res) => {
    console.log(req.body);
    const blogType = req.body.blogType;
    res.render("newBlog.ejs",{typeOfBlog: blogType});
});

app.post("/addBlog",async (req,res) => {
    console.log(req.body);
    const blogType = req.body.blogType;
    const blogTitle = req.body.blogTitle;
    const blogContent = req.body.blogContent;

    if(blogType === "College"){
        
        await createNewCollegeBlog(blogTitle,blogContent);
        blogList = await findCollegeBlogs();
    }
    else{
   
        await createNewSchoolBlog(blogTitle,blogContent);
        blogList = await findSchoolBlogs();
    }
    
    res.render("index.ejs",{typeOfBlogs: blogType,blogs: blogList});
});

app.post("/detailedBlog" , async (req,res) => {
    console.log(req.body);

    const blogType = req.body.blogType;
    const blogId = req.body.blogId;

    var blogObject = {};

    if(blogType === "College"){
        blogObject = await collegeBlogModel.findOne({_id: blogId});
    }
    else{
        blogObject = await schoolBlogModel.findOne({_id: blogId});
    }

    console.log("Printing object\n");
    console.log(blogObject);
    
    blogObject._id = blogId;
    blogObject.type = blogType;

    res.render("detailedBlog.ejs" , {blog: blogObject});

});

app.post("/actions" , async (req,res) => {
    const action = req.body.action;

    const blogToUpdate = {
            _id: req.body.blogId,
            type: req.body.blogType,
            title: req.body.blogTitle,
            content: req.body.blogContent
    };

    if (action === "edit") {
        res.render("edit.ejs", {blog: blogToUpdate});
    }
    else if(action === "delete"){
        if(req.body.blogType === "College"){
            await collegeBlogModel.findByIdAndDelete({_id: req.body.blogId});
        }
        else{
            await schoolBlogModel.findByIdAndDelete({_id: req.body.blogId});
        }

        res.render("delete.ejs");
    }
    else{
        console.log(action);
        res.sendStatus(404);
    }
});


app.post("/updateBlog",async (req,res) => {
    // console.log(req.body);

    const blogId = req.body.blogId;
    const blogType = req.body.blogType;
    const blogTitle = req.body.blogTitle;
    const blogContent = req.body.blogContent;

    var blogObject = {
        title: blogTitle,
        content: blogContent
    };

    if(blogType === "College"){
        await collegeBlogModel.findByIdAndUpdate({_id: blogId}, { $set: blogObject});
        blogObject = await collegeBlogModel.findById({_id: blogId});
    }
    else{
       await schoolBlogModel.findByIdAndUpdate({_id: blogId}, { $set: blogObject});
       blogObject = await schoolBlogModel.findById({_id: blogId});
    }

    blogObject.type = blogType;
    
    console.log("after updation ");
    console.log(blogObject);
    res.render("detailedBlog.ejs" , {blog: blogObject});
});



app.listen(port,()=>{
    console.log(`Server is listening on port: ${port}`);
});