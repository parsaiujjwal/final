import express from "express"
const router = express.Router();
import { signUp,  signIn, signOut} from "../controller/user.controller.js"
import { verify } from "../middleware/tokenVarification.js";
import { body } from "express-validator";

import multer from "multer";

const upload = multer({ dest: "public/profilephoto/" })

router.post("/signUp",
    body("name", "name is required").trim()
    .notEmpty().withMessage('Name is required')
    .matches(/^[A-Za-z\s]+$/).withMessage('Name must contain only letters and spaces')
    .isLength({ max: 50 }).withMessage('Name must not exceed 50 characters'),
    body("userName").notEmpty(),
    body("password").notEmpty().isStrongPassword({
        maxLength:8,
        minLowercase:1,
        minUppercase:1,
        minNumbers:1,
        minLength:6
    }).withMessage("password must contain upercase,lowercase,number"),
    body("contact").isNumeric(),
    body("email").isEmail()
,signUp);                   
router.post("/signin",signIn)
router.get("/signout", signOut);
export default router;
