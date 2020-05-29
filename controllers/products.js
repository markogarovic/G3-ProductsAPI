const Product = require("../models/products");

function findByName(name) {
    return new Promise((resolve, reject) => {
        try {
            console.log(name)
            resolve(Product.find({name : name}).exec())
        } catch (e) {
            console.log(e);
            reject(false)
        }

    })
}

function findAll() {
    return new Promise((resolve, reject) => {
        try {
            resolve(Product.find({}).lean().exec())
        } catch (e) {
            console.log(e);
            reject(false)
        }

    })
}

function create(ProductToCreate) {
    return new Promise((resolve, reject) => {
        try {
            resolve(Product.create(ProductToCreate))
        } catch (e) {
            console.log(e);
            reject(false)
        }

    })
}

function deleteProduct(ProductToDelete){
    return new Promise((resolve, reject) => {
        try {
            resolve(Product.findOneAndDelete(ProductToDelete))
        } catch (e) {
            console.log(e);
            reject(false)
        }

    })
}
function update(ProductToUpdate, query){
    return new Promise((resolve, reject) => {
        try {
            resolve(Product.findOneAndUpdate(ProductToUpdate,query))
        } catch (e) {
            console.log(e);
            reject(false)
        }

    })
}

module.exports = {
    findByName,
    findAll,
    create,
    delete: deleteProduct,
    update
}