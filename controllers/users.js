const User = require("../models/users");

function findByUsername(username) {
    return new Promise((resolve, reject) => {
        try {
           
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
      resolve(User.findOneAndDelete({username:UserToDelete}));
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

function update(UserToUpdate, query){
    return new Promise((resolve, reject) => {
        try {
            resolve(User.findOneAndUpdate({username:UserToUpdate},query))
        } catch (e) {
            console.log(e);
            reject(false)
        }

    })

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
  findByUsername,
  findAll,
  create,
  delete: deleteUser,
  update,
};
