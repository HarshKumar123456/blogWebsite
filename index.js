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
    const type = "Home";
    blogList = await findCollegeBlogs();
    res.render("index.ejs",{typeOfBlogs: type,blogs: blogList});
});

app.get("/school" , async (req,res) => {
    const type = "School";
    blogList = await findSchoolBlogs();
     res.render("index.ejs",{typeOfBlogs: type,blogs: blogList});
});

app.get("/college" , async (req,res) => {
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

app.get("/detailedBlog" , async (req,res) => {
    console.log(req.body);
    
});

app.listen(port,()=>{
    console.log(`Server is listening on port: ${port}`);
});