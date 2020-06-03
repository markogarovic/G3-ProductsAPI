const mongoose = require("mongoose");
const validate = require("mongoose-validator");
require("mongoose-type-email");

const usernameValidator = [
  validate({
    validator: "isLength",
    arguments: [3, 20],
    message: "Username should be between 3 and 20 characters",
  }),
];
const passwordValidator = [
  validate({
    validator: "matches",
    arguments: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,25}$/,
    message: "Invalid password",
  }),
  validate({
    validator: "isLength",
    arguments: [5, 25],
    message: "Password should be between 5 and 25 characters",
  }),
];

const emailValidator = [
  validate({
    validator: "matches",
    arguments: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    message: "Invalid email",
  }),
];

const user = new mongoose.Schema({
  username: {
    type: String,
    validate: usernameValidator,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    validate: passwordValidator,
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    unique: true,
    validate: emailValidator,
    required: true,
  },
  role: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "product",
    },
  ],
});

user.index({ username: 1 });

module.exports = mongoose.model("user", user);
