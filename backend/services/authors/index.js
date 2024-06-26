import { Router } from "express"
import Author from "./model.js"
import bcrypt from "bcryptjs"
import Blog from "../blogs/model.js"
import multerAvatar from "../../config/multerAvatar.js"
import "dotenv/config"
import { authMidd, generateJWT } from "../../auth/index.js"
import passport from "passport"

export const authorRoute = Router()

authorRoute.get("/googleLogin",
  passport.authenticate("google", {scope: ["profile", "email"]}));
authorRoute.get("/callback",
  passport.authenticate("google", {session: false}), (req, res, next) => {
    try {
      res.redirect(`http://localhost:3000/home`); //authors/profile?accessToken=${req.user.accToken}
    } catch (error) {
      next(error);
    }
  });

authorRoute.post("/login", async (req, res, next) => {
  try {
    let foundUser = await Author.findOne({
      email: req.body.email,
    });
    if (foundUser) {
      const PasswordMatching = await bcrypt.compare(
        req.body.password,
        foundUser.password);
      if (PasswordMatching) {
        const token = await generateJWT({
          _id: foundUser._id,
        });
        res.send({token});
      } else {
        res.status(400).send("Password errata!")
      }
    } else {
      res.status(400).send("L'utente non esiste!")
    };
  } catch (error) {
    next(error);
  }
});

authorRoute.get("/", async (req, res, next) => {
  try {
    const page = req.query.page || 1
    let authors = await Author.find()
      .limit(20)
      .skip(20 * (page - 1))
    res.send(authors)
  } catch (error) {
    next(error)
  }
})

authorRoute.get("/me", async (req, res, next) => {
  try {
    let author = await Author.findById(req.user.id)
    res.send(author)
  } catch (error) {
    next(error)
  }
})

authorRoute.get("/:id", async (req, res, next) => {
  try {
    let author = await Author.findById(req.params.id)
    res.send(author)
  } catch (error) {
    next(error)
  }
})

authorRoute.get("/:id/blogPosts", async (req, res, next) => {
  try {
    let author = await Author.findById(req.params.id)

    let posts = await Blog.find({
      author: author.email,
    })
    res.send(posts)
  } catch (error) {
    next(error)
  }
})

authorRoute.patch("/:id/avatar", authMidd, multerAvatar, async (req, res, next) => {
  try {
    let author = await Author.findByIdAndUpdate(
      req.params.id,
      {
        avatar: req.file.path,
      },
      { new: true }
    )
    res.send(author)
  } catch (error) {
    next(error)
  }
})

authorRoute.put("/:id", authMidd, async (req, res, next) => {
  try {
    let author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    res.send(author)
  } catch (error) {
    next(error)
  }
})

authorRoute.delete("/:id", authMidd, async (req, res, next) => {
  try {
    await Author.deleteOne({
      _id: req.params.id,
    })
    res.send(204)
  } catch (error) {
    next(error)
  }
})

authorRoute.post("/", async (req, res, next) => {
  try {
    let author = await Author.create({
      ...req.body,
      password: await bcrypt.hash(req.body.password, 10),
    })
    res.send(author)
  } catch (error) {
    next(error)
  }
})