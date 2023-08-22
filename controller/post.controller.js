import { Post } from "../model/post.model.js";
import { request, response } from "express";
import { User } from "../model/user.model.js";


export const postPage = (request, response, next) => { }

export const getAllPost =async (request, response, next) => {
    let page = parseInt(request.query.page) || 1;
    let perPage =3;
    try {
        let totalpost= await Post.find();
       await Post.find().populate('userId').sort({ _id: -1 }).skip((page - 1) * perPage).limit(perPage)
            .then((result) => {
                result.map((item)=>{
                    return item.userId.password=undefined;
                })
                return response.status(200).json({ message: "data found", result: result,totalpost:totalpost.length, status: true });
            });
    } catch (error) {
        return response.status(500).json({ error: "internal server error", status: true });
    }
}

export const uploadPost = async (request, response) => {
    let file = await (request.file) ? request.file.filename : null;
    if (!file)
        return response.status(400).json({ result: "bad request", status: false })
        request.body.file = file;
    try {
        request.body.type=request.file.mimetype;
        request.body.isLiked = false;
        Post.create(request.body)
        return response.status(200).json({ message: "post uploaded by user ", status: true });
    } catch (err) {
        return response.status(500).json({ result: "internal server error", status: false });
    }
}

export const getAllLikes = (request, response, next) => {
    Post.findById({ _id: request.body.postId })
        .populate("likeItems.friendUserId").then(result => {
            return response.status(200).json(result);
        }).catch(err => {
            return response.status(500).json({ message: "internal server error", status: false })
        })
}

export const getSavedPost = (request, response, next) => {
    Post.findById({ _id: request.body.postId })
        .populate("saveItems.friendUserId").then(result => {
            return response.status(200).json(result);
        }).catch(err => {
            console.log(err);
            return response.status(500).json({ message: "internal server error", status: false })
        })
}

export const getAllComments = (request, response, next) => {
    Post.findById({_id:request.body.userPostId }).populate("commentItems.friendUserId").then(result => {
        return response.status(200).json({ message: "data found", result: result, status: true })
    }).catch(err => {
        return response.status(500).json({ error: "internal server error", status: false });
    })




}


export const likePost = async (request, response, next) => {
    try {
        let postFound = await Post.findOne({ _id: request.body.postId });
        if (postFound) {
            if (postFound.likeItems.some((item) => item.friendUserId == request.body.friendUserId)) {
                let index = postFound.likeItems.findIndex((user) => { return user.friendUserId == request.body.friendUserId });
                postFound.likeItems.splice(index, 1);
                await postFound.save();
                return response.status(200).json({ message: " you unliked the post", status: true })
            } else {
                await postFound.save();
                return response.status(200).json({ message: "like the post", status: true })
            }
        }
        else {
            await Post.create({ postId: request.body.postId, likeItems: [{ friendUserId: request.body.friendUserId }] });
        }
    }
    catch (err) {
        return response.status(500).json({ error: "internal server error", status: false });
    }
}

export const commentPost = async (request, response, next) => {
    try {
        let postFound = await Post.findOne({ _id: request.body.postId });
        await postFound.save();
        return response.status(200).json({ message: "comment successful", status: true })

    } catch (error) {
        console.log(error);
        return response.status(500).json({ error: "internal server error", status: false });
    }
}

export const getPostById = async (request, response) => {
    try {
        return response.status(200).json({ posts: await Post.find({ userId: await User.findById({ _id: request.body.userId }) }) });
    } catch (err) {
        return response.status(500).json({ error: "internal server error", status: false });
    }
}

export const deletepost = (request, response) => {
    console.log("check1")
    Post.findByIdAndDelete({ _id: request.body.postId })
        .then(result => {
            if (!result) {
                console.log("page not found ")
                return response.status(404).json({ message: "Post not found", status: false });
            }
            return response.status(200).json({ message: "Post deleted", status: true });
        })
        .catch(err => {
            console.log(err)
            return response.status(500).json({ error: "Internal server error", status: false });
        });
};

export const editblog = async (request, response, next) => {
    try {
        let post = await Post.updateOne({ _id: request.body.id }, {
            $set: {
                caption: request.body.caption,              
            }
        })
        return response.status(200).json({ message: " Post updated ... ", status: true })
    } catch (err) {
        return response.status(500).json({ message: " Post updated failed ... ", status: false })
    }
}