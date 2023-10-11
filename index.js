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

  const blogList = [
    {
        _id: 1,
        title: "First school blog",
        content: "This is just for fun. Alright OK Ekdam thik Hahahaahhahahahah"
    },
    {
        _id: 2,
        title: "Second school blog",
        content: "This is just for fun. Alright OK Ekdam thik Hahahaahhahahahah"
    },
    {
        _id: 3,
        title: "Third school blog",
        content: "This is just for fun. Alright OK Ekdam thik Hahahaahhahahahah"
    },
    {
        _id: 4,
        title: "Fourth school blog",
        content: "This is just for fun. Alright OK Ekdam thik Hahahaahhahahahah"
    },
  ];


app.get("/" , (req,res) => {
    const type = "Home";
    res.render("index.ejs",{typeOfBlogs: type,blogs: blogList});
});

app.get("/school" , (req,res) => {
    const type = "School";
     res.render("index.ejs",{typeOfBlogs: type,blogs: blogList});
});

app.get("/college" , (req,res) => {
    const type = "College";
     res.render("index.ejs",{typeOfBlogs: type,blogs: blogList});
});

app.listen(port,()=>{
    console.log(`Server is listening on port: ${port}`);
});