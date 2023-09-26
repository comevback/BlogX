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

app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
});

app.get("/", (req, res) => {
    res.render("index.ejs");
});