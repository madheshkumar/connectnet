import express from "express";
import multer from "multer";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import likeRoutes from "./routes/likes.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import messageRoutes from "./routes/messages.js";
import activityRoutes from "./routes/activities.js";

import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import socketHandlers from "./socket.js";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

//middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(cookieParser());

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/postimages");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/postvideos");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/profileimages");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const coverStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/coverimages");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const uploadProfile = multer({ storage: profileStorage });

const uploadCover = multer({ storage: coverStorage });

const uploadImage = multer({ storage: imageStorage });

const uploadVideo = multer({ storage: videoStorage });

app.post("/api/uploadimage", uploadImage.single("image"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.post("/api/uploadvideo", uploadVideo.single("video"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.post("/api/uploadprofile", uploadProfile.single("profile"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.post("/api/uploadcover", uploadCover.single("cover"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/activities", activityRoutes);

socketHandlers(io);

server.listen(8800, () => {
  console.log("Server connected successfully!");
});

export { io };
