import mongoose from "mongoose";
import bodyParser from "body-parser";
import express from "express";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import postRoute from "./routes/post.route.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";

const app = express();

app.use(bodyParser.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));
app.get("/",(req,res)=>{
    res.setHeader("Access-Control-Allow-Credentials",true);
    res.setHeader("Access-Control-Allow-Origin: *");
    
});
const url="mongodb+srv://ujjwalparsai109:ujjwal6660@cluster0.0shrke3.mongodb.net/blogpage"

mongoose.connect(url)
    .then(result => {
        app.use(cors());
        app.use("/user", userRoute);
        app.use("/admin", adminRoute);
        app.use("/post", postRoute);

        app.listen(3000, () => {
            console.log("server started...");
        })
    })
    .catch(err => {
        console.log(err);
    })

