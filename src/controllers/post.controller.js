import Post from '../models/Post.model'
import createHttpError from 'http-errors'
import expressAsyncHandler from 'express-async-handler'
import { newPostSchema } from '../utilities/form.schema'
import User from '../models/User.model'
import mongoose from 'mongoose'

export const getAllPost = expressAsyncHandler(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 1;

    const skip = (page - 1) * limit;
    const posts = await Post.find().populate({
      path: 'posted_by'
    }).limit(limit).skip(skip)

    if(!posts || posts.length < 1) return next(createHttpError(404))

    return res.status(200).json({
    meta: {
      total: posts.length,
      limit,
      page,
      skip
    },data: [posts]
    })
  } catch (err) {
    return next(err)
  }
})

export const createNewPost = expressAsyncHandler(async (req, res, next) => {
  try {
    const data = await newPostSchema.validateAsync(req.body)

    const url = req.protocol + '://' + req.get('host')

    const preview_image = url + '/public/' + req.files.preview_image[0].filename

    const images = req.files.images.map(image => url + '/public/' + image.filename)

    const user = await User.findById(data.posted_by)

    if(!user) return next(createHttpError(404, 'User not found'))

    const newPost = new Post({...data, preview_image, images})


    const savedPost = await newPost.save();

    if(!savedPost) return next(createHttpError(409, 'Create post unsuccessful'))

    await user.posts.push(savedPost)

    const savedPostIdToUser = await user.save();

    if(!savedPostIdToUser) return next(createHttpError(409, 'Can\'t save post id to user posts'))

    return res.status(201).json({
      status: 201,
      message: 'successfully created post',
      post: savedPost
    })
  } catch (err) {
    return next(err)
  }
})

export const getPostById = expressAsyncHandler(async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)

    if(!post) return next(createHttpError(404))

    return res.status(200).json({
      status: 200,
      post
    })
  } catch (err) {
    return next(err)
  }
})