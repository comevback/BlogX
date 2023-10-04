import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import {mongoUrl} from "./config.js";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect(mongoUrl)
.then(() => {
    console.log(`Connected to MongoDB.`);
})
.catch(error => {
    console.error(`MongoDB connection error: ${error}`);
});

const ArticlesAchema = new mongoose.Schema({
    title: String,
    article: String
})
const Articles = mongoose.model("article", ArticlesAchema);

const examArt = new Articles({
    title: "Example-article",
    article: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in ligula ut urna tincidunt tristique. Sed euismod bibendum ipsum, eu cursus arcu eleifend id. Vivamus nec justo non sapien consequat elementum. Cras tincidunt, nisi at ullamcorper rhoncus, metus purus suscipit erat, nec rhoncus tortor odio eu ligula. Integer id lectus nec dolor dictum faucibus. Aliquam ullamcorper eget urna at interdum. Donec vehicula bibendum lectus, vel lacinia lectus ullamcorper nec. Sed euismod mauris ut ex feugiat, non convallis justo luctus."
});

let articles = await Articles.find({});
//console.log(articles);


app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
});

app.get("/", async(req, res) => {
    if (articles.length === 0){
        Articles.insertMany([examArt]).then(() => {console.log(`No articles in the DB, added the default article.`);}).catch((err) => {console.log(err);});
        articles = await Articles.find({});
        console.log(`now the db has ${articles.length} articles.`);
        res.redirect("/");
    }else{
        articles = await Articles.find({});
        console.log(`${articles.length} articles in the DB.`);
        res.render("index.ejs", {
            articles: articles
        });
    }
});

app.post("/show", async(req, res) => {
    const item = req.body.show;
    try{
        const art = await Articles.findById(item);
        res.render("show.ejs", {
            article: art
        });
    }catch(err){
        console.log(err);
    }    
});

app.get("/add" ,(req, res) => {
    res.render("add.ejs");
});

app.post("/add", async(req, res) => {
    const title = req.body.title;
    const input = req.body.article;
    console.log("title: " + title + "\narticle: "+ input);
    const newArt = new Articles({
        title : title,
        article: input
    });
    try {
        await Articles.insertMany([newArt]);
        console.log(`Added a new article into the DB`);
        articles = await Articles.find({}, { article: 1 });
        console.log(`now the db has ${articles.length} articles.`);
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/edit", async(req, res) => {
    const edit = req.query.edit;
    console.log(edit);
    try{
        const art = await Articles.findById(edit);
        res.render("edit.ejs", {
            article: art
        });
    }catch(err){
        console.log(err);
    }
});

app.post("/edit", async(req, res) => {
    const title = req.body.title;
    const input = req.body.article;
    const id = req.body.id;
    try{
        await Articles.findByIdAndUpdate(id, {title: title, article: input});
        res.redirect("/");
    }catch(err){
        console.log(err);
    }
});

app.post("/delete", async(req, res) => {
    const itemDelete = req.body.delete;
    console.log(itemDelete);
    try{
        await Articles.findByIdAndRemove(itemDelete);
        console.log(`The article ${itemDelete} was deleted.`);
        res.redirect("/");
    }catch(err){
        console.log(err);
    }
});

app.get("/about", (req,res) => {
    res.render("about.ejs");
})