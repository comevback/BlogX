import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const mongoUrl = "mongodb+srv://xuxiang5012:986532xx@cluster0.xvxt0us.mongodb.net/todoList?retryWrites=true&w=majority";


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect(mongoUrl).then(console.log(`Connected to mongoDB.`));

app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
});

app.get("/", (req, res) => {
    res.render("index.ejs");
});