"use strict";

const path = require("path");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../database/database.sqlite"),
});

module.exports = sequelize;
