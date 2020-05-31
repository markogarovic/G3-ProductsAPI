const User = require("../models/users");

function findByusername(username) {
    return new Promise((resolve, reject) => {
        try {
            console.log(username)
            resolve(User.find({username : username}).exec())
        } catch (e) {
            console.log(e);
            reject(false)
        }

    })
}

function findAll() {
    return new Promise((resolve, reject) => {
        try {
            resolve(User.find({}).lean().exec())
        } catch (e) {
            console.log(e);
            reject(false)
        }

    })
}

function create(UserToCreate) {
    return new Promise((resolve, reject) => {
        try {
            resolve(User.create(UserToCreate))
        } catch (e) {
            console.log(e);
            reject(false)
        }

    })
}

function deleteUser(UserToDelete){
    return new Promise((resolve, reject) => {
        try {
            resolve(User.findOneAndDelete(UserToDelete))
        } catch (e) {
            console.log(e);
            reject(false)
        }

    })
}
function update(UserToUpdate, query){
    return new Promise((resolve, reject) => {
        try {
            resolve(User.findOneAndUpdate(UserToUpdate,query))
        } catch (e) {
            console.log(e);
            reject(false)
        }

    })
}

// 7. dio domaceg



module.exports = {
    findByusername,
    findAll,
    create,
    delete: deleteUser,
    update
}