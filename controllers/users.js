const User = require("../models/users");

function findByusername(username) {
<<<<<<< HEAD
    return new Promise((resolve, reject) => {
        try {
            resolve(User.find({username : username}).exec())
        } catch (e) {
            console.log(e);
            reject(false)
        }

    })
=======
  return new Promise((resolve, reject) => {
    try {
      console.log(username);
      resolve(User.find({ username: username }).exec());
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
>>>>>>> 8a5aef99312475c68224564d723e0ed884580b4e
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
      resolve(User.findOneAndDelete(UserToDelete));
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}
<<<<<<< HEAD
function update(UserToUpdate, query){
    return new Promise((resolve, reject) => {
        try {
            resolve(User.findOneAndUpdate({username:UserToUpdate},query))
        } catch (e) {
            console.log(e);
            reject(false)
        }

    })
=======
function update(UserToUpdate, query) {
  return new Promise((resolve, reject) => {
    try {
      resolve(User.findOneAndUpdate(UserToUpdate, query));
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
>>>>>>> 8a5aef99312475c68224564d723e0ed884580b4e
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
  findByusername,
  findAll,
  create,
  delete: deleteUser,
  update,
};
