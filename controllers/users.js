const User = require("../models/users");

function findById(id){
  return new Promise((resolve, reject) => {
    try {
      resolve(User.findById(id).exec());
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}
function findByUsername(username) {
  return new Promise((resolve, reject) => {
    try {
      resolve(User.find({ username: username }).exec());
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}
function findProductAndUpdate(username, id) {
  return new Promise((resolve, reject) => {
    try {
      resolve(
        User.findOneAndUpdate(
          { username: username },
          { $push: { product: id } },
          { new: true }
        ).exec()
      );
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}
function findAll() {
  return new Promise((resolve, reject) => {
    try {
      resolve(User.find({}).lean().exec());
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

function create(UserToCreate) {
  return new Promise((resolve, reject) => {
    try {
      resolve(User.create(UserToCreate));
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

function deleteUser(UserToDelete) {
  return new Promise((resolve, reject) => {
    try {
      resolve(User.findOneAndDelete({ username: UserToDelete }));
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

function deleteProductField(userName, productField) {
  return new Promise((resolve, reject) => {
    try {
      resolve(
        User.update(
          { username: userName },
          { $pull: { product: { $in: [productField] } } },
          { new: true }
        ).exec()
      );
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

function update(UserToUpdate, query) {
  return new Promise((resolve, reject) => {
    try {
      resolve(User.findOneAndUpdate({ username: UserToUpdate }, query));
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}



// 7. dio domaceg
/*
function addProductField(username, id) {
  return new Promise((resolve, reject) => {
    try {
      let userFound = findByusername(username);
      resolve(User.findOneAndUpdate(userFound, query));
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

function getProductField(username, id) {
  return new Promise((resolve, reject) => {
    try {
      let userFound = findByusername(username);
      resolve(userFound.product.push(id));
      resolve();
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}
*/
module.exports = {
  findById,
  findByUsername,
  findAll,
  create,
  delete: deleteUser,
  update,
  findProductAndUpdate,
  deleteProductField,
};
