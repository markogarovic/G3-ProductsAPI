const mongoose = require("mongoose");
const validate = require("mongoose-validator");

const nameValidator = [
  validate({
    validator: "isLength",
    arguments: [3, 15],
    message: "Name should be between 3 and 15 characters",
  }),
];
const descriptionValidator = [
  validate({
    validator: "isLength",
    arguments: [10, 150],
    message: "Name should be between 10 and 150 characters",
  }),
];

const product = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    validate: nameValidator,
  },
  description: {
    type: String,
    validate: descriptionValidator,
  },
  image: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
    max: 10000,
  },
  quantity: {
    type: Number,
    min: 1,
    max: 10,
    default: 1,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
});
product.index({ name: 1 });
const ProductModel = mongoose.model("product", product);
module.exports = ProductModel;
