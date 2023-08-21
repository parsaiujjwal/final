import { response } from "express";

import { User } from "../model/user.model.js";
import { Admin } from "../model/admin.model.js";



export const editProfile = async (request, response, next) => {
    try {
        let admin = await Admin.updateOne({ _id: request.body.id }, {
            $set: {
                bio: request.body.bio,
                profilePhoto: request.body.profilePhoto                
            }
        })
        return response.status(200).json({ message: " Profile updated ... ", status: true })
    } catch (err) {
        return response.status(500).json({ message: " Profile updated failed ... ", status: false })
    }
}

export const deletePost = (request, response, next) => {
    AdminPosts.findOneAndRemove({ _id: request.params.adminPostId }).then(result => {
        return response.status(200).json({ message: "Post removed", status: true });
    }).catch(err => {
        return response.status(500).json({ error: "Internal Server Error", status: false });
    })
}

export const signUp = async (request, response) => {
    try {
        return response.status(200).json({ user: await Admin.create(request.body) });
    } catch (err) {
        return response.status(500).json({ error: "Internal Server Error", status: false });
    }
}

export const adminPost = (request, response) => {
    request.body.date = new Date().toString().substring(4, 15).replaceAll(' ', '/')
    AdminPosts.create(request.body).then(result => {
        return response.status(200).json({ message: "post added" });
    }).catch(err => {
        return response.status(500).json({ error: "internal server errore" })
    })
}
