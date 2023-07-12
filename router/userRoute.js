const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  try {
    const userList = await User.find().select("name email phone");
    if (!userList)
      return res
        .status(400)
        .json({ success: false, message: "user is not founds " });

    res.send(userList);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "erroe occure durin fatching deta ",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");

    if (!user) {
      res
        .status(500)
        .json({ message: "The user with the given ID was not found." });
    }
    res.status(200).send(user);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "erroe occure durin fatching deta ",
      error: error.message,
    });
  }
});

router.post("/register", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();

  if (!user) return res.status(400).send("the user cannot be created!");

  res.send(user);
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.secret;
    if (!user) {
      return res.status(400).json({
        success: false,
        message: " user not found ",
      });
    }
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const token = jwt.sign(
        { userId: user.id, isAdmin: user.isAdmin },
        secret,
        { expiresIn: "1d" }
      );
      res.status(200).json({
        success: true,
        message: "user authenticated",
        user: user.email,
        token,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "password is wrong!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal erroe occur",
      error: error.message,
    });
  }
});

router.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "The user is deleted" });
      } else {
        return res
          .status(500)
          .json({ success: false, meaasage: "user not deleted" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

router.get(`/get/count`, async (req, res) => {
  const userCount = await User.countDocuments();

  if (!userCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    userCount: userCount,
  });
});

module.exports = router;
