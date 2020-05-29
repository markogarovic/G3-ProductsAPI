const mongoose = require("mongoose");
const validate = require("mongoose-validator");
require("mongoose-type-email")

const usernameValidator = [
    validate({
      validator: 'isLength',
      arguments: [3, 20],
      message: 'Username should be between 3 and 20 characters',
    })
]
const passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,25}$/
    }),
    validate({
        validate: 'isLength',
        arguments: [5, 25],
        message: 'Password should be between 5 and 25 characters'
    })
]

const user = new mongoose.Schema(
    {
        username:{
            type:String,
            validate: usernameValidator,
            require: true,
            unique: true
        },
        password:{
            type:String,
            require: true,
            validate: passwordValidator,
            minlength: 5
        },
        email: {
            type: mongoose.SchemaType.Email,
            unique: true
        },
        role: Number,
        product:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "product"
        }


    }
)

module.exports = mongoose.model('user', user)