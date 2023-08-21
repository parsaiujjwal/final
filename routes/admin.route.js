import express from "express";
import {editProfile,signUp,adminPost ,deletePost} from "../controller/admin.controller.js";

const router =express.Router();
router.post("/uploadPost",adminPost)  
router.post("/editProfile",editProfile);
router.get("/deletePost",deletePost);


 
router.post("/signUp",signUp)       

export default router;