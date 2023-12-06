import express, { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import conn from "./db/conn";
import dotenv from "dotenv";
import User from "./models/User";

dotenv.config();

const app = express();
conn();

app.use(express.json());

app.get("/", (_, res) => {
  res.status(200).json({ msg: "Hello world" });
});

app.post("/auth/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // validations
  if (!name) {
    return res.status(422).json({ msg: "Name required" });
  }

  if (!email) {
    return res.status(422).json({ msg: "Email required" });
  }

  if (!password) {
    return res.status(422).json({ msg: "Password required" });
  }

  if (password !== confirmPassword) {
    return res.status(422).json({ msg: "Passwords doesn't match" });
  }

  // check if user is already registered
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(422).json({ msg: "User already registered" });
  }

  // create password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // create user
  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await user.save();
  } catch (error) {
    return res.status(500).json(error);
  }

  return res.status(201).json({ msg: "User registered successfully" });
});

app.post("/auth/user", async (req, res) => {
  const { email, password } = req.body;

  // validations
  if (!email) {
    return res.status(422).json({ msg: "Email required" });
  }

  if (!password) {
    return res.status(422).json({ msg: "Password required" });
  }

  // check if user is registered
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  // check password
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Invalid password" });
  }

  try {
    const secret = process.env.SECRET || "";

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    return res.status(200).json({ msg: "User authenticated", token });
  } catch (error) {
    return res.status(500).json(error);
  }
});

const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = (authHeader || " ").split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Access denied" });
  }

  try {
    const secret = process.env.SECRET || "";
    jwt.verify(token, secret);
  } catch (error) {
    return res.status(400).json({ msg: "Invalid token" });
  }

  return next();
};

app.get("/user/:id", checkToken, async (req, res) => {
  const { id } = req.params;

  // check if user exists
  if (!Types.ObjectId.isValid(id)) {
    return res.status(404).json({ msg: "Invalid id" });
  }

  const user = await User.findById(id, "-password");

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  return res.status(200).json(user);
});

app.listen(3000, () => {
  console.log("listening on 3000");
});
