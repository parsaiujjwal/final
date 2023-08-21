import { User } from "../model/user.model.js"

import { Post } from "../model/post.model.js";

import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import path from "path";
import fs from 'fs';
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";


const __dirname = path.dirname(fileURLToPath(import.meta.url));



export const signUp = async (request, response, next) => {
    try {
        let error = validationResult(request);
        if (!error.isEmpty())
            return response.status(400).json({ error: "bad request", status: false, message: error.array() });
        let email = await User.findOne({ email: request.body.email })
        if (email)
            return response.status(400).json({ message: "already exist", status: false });
        let salt = await bcrypt.genSalt(10);
        request.body.password = await bcrypt.hash(request.body.password, salt);
        let user = await User.create(request.body)
        return (user)
            ? response.status(200).json({ user: { ...user.toObject(), password: undefined }, token: jwt.sign({ subject: user.email }, 'fdfxvcvnreorevvvcrerer'), status: true })
            : response.status(401).json({ message: "Unauthorized person", status: false })
    } catch (err) {
        console.log(err);
        return response.status(500).json({ error: "internal server error", status: false });
    }
}



export const getAllPost = async (request, response) => {
    try {
        let post = await Post.find({ userId: request.params.userId });
        if (post)
            return response.status(200).json({ message: "data found", result: post, status: true })
        return response.status(500).json({ message: "post not found", status: false })

    } catch (err) {
        console.log(err)
        return response.status(500).json({ message: "internal server errore", status: false })
    }

}

export const signUps = async (request, response, next) => {
    try {
        let error = validationResult(request);
        if (!error.isEmpty())
            return response.status(400).json({ error: "bad request", status: false, message: error.array() });
        let email = await User.findOne({ email: request.body.email })
        if (email)
            return response.status(400).json({ message: "already exist", status: false });
        let salt = await bcrypt.genSalt(10);
        request.body.password = await bcrypt.hash(request.body.password, salt);
        let user = await User.create(request.body)
        return (user)
            ? response.status(200).json({ user: { ...user.toObject(), password: undefined }, token: jwt.sign({ subject: user.email }, 'fdfxvcvnreorevvvcrerer'), status: true })
            : response.status(401).json({ message: "Unauthorized person", status: false })
    } catch (err) {
        console.log(err);
        return response.status(500).json({ error: "internal server error", status: false });
    }
}

export const signIn = async (request, response, next) => {
    try {
        const user = await User.findOne({ $or: [{ email: request.body.usernameOrEmail }, { userName: request.body.usernameOrEmail }] });
        if (!user)
            return response.status(400).json({ error: "bad request", status: false })
        return (await bcrypt.compare(request.body.password, user.password))
            ? response.status(200).json({ user: { ...user.toObject(), password: undefined }, token: jwt.sign({ subject: user.email }, 'fdfxvcvnreorevvvcrerer'), status: true })
            : response.status(401).json({ message: "Unauthorized person", status: false })
    }
    catch (err) {
        return response.status(500).json({ error: "internal server error", status: false });
    }
}

export const signOut = async (request, response) => {
    try {
        return response.status(200).json({ message: "user logged out", status: true });
    } catch (err) {
        console.log(err);
        return response.status(500).json({ error: "internal server error", status: false });
    }
}





