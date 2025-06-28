"use strict";

const express = require("express");
const User = require("../models/user.js");

const router = express.Router();

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new user
router.post("/users", async (req, res) => {
  try {
    const reqBody = req.body;
    const username =
      typeof reqBody.username === "string"
        ? reqBody.username.trim()
        : undefined;
    const email =
      typeof reqBody.email === "string" ? reqBody.email.trim() : undefined;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors = {};
    if (!username) {
      errors.username = "REQUIRED";
    }
    if (!email) {
      errors.email = "REQUIRED";
    } else if (!emailRegex.test(email)) {
      errors.email = "INVALID_EMAIL";
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          fields: errors,
        },
      });
    }
    const user = await User.create({ username, email });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
