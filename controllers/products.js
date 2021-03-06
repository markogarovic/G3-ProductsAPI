const Product = require("../models/products");

function findByName(name) {
  return new Promise((resolve, reject) => {
    try {
      console.log(name);
      resolve(Product.find({ name: name }).exec());
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

function findAll() {
  return new Promise((resolve, reject) => {
    try {
      resolve(Product.find({}).lean().exec());
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

function create(ProductToCreate) {
  return new Promise((resolve, reject) => {
    try {
      resolve(Product.create(ProductToCreate));
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

function deleteProduct(ProductToDelete) {
  return new Promise((resolve, reject) => {
    try {
      resolve(Product.findOneAndDelete(ProductToDelete));
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}
function update(ProductToUpdate, query) {
  return new Promise((resolve, reject) => {
    try {
      resolve(Product.findOneAndUpdate({ name: ProductToUpdate }, query));
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}
function findProductId(productName) {
  return new Promise((resolve, reject) => {
    try {
      resolve(Product.find({ name: productName }, { _id: 1 }).exec());
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

// 7. zadatak sa domaceg

function findById(id) {
  return new Promise((resolve, reject) => {
    try {
      console.log(id);
      resolve(Product.findById(id).exec());
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}
function deleteById(id) {
  return new Promise((resolve, reject) => {
    try {
      console.log(id);
      resolve(Product.findById(id).remove().exec());
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}
function updateById(id, query) {
  return new Promise((resolve, reject) => {
    try {
      resolve(Product.findOneAndUpdate({ _id: id }, query));
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}
function decProductNumber(id) {
  return new Promise((resolve, reject) => {
    try {
      (async () => {
        const product = await Product.find({ _id: id }).lean().exec();
        console.log(product[0].quantity);
        if (product[0].quantity > 1) {
          resolve(Product.update({ _id: id }, { $inc: { quantity: -1 } }));
        } else {
          reject("Min quantity");
        }
      })();
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}
function incProductNumber(id) {
  return new Promise((resolve, reject) => {
    try {
      (async () => {
        const product = await Product.find({ _id: id }).lean().exec();
        console.log(product[0].quantity);
        if (product[0].quantity < 10) {
          resolve(Product.update({ _id: id }, { $inc: { quantity: 1 } }));
        } else {
          reject("Max quantity");
        }
      })();
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}
function numberOfProducts(id) {
  return new Promise((resolve, reject) => {
    try {
      (async () => {
        const product = await Product.find({ _id: id }).lean().exec();
        resolve(product[0].quantity);
      })();
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}
function findGroupOfProducts(limit, offset) {
  return new Promise((resolve, reject) => {
    try {
      resolve(Product.find({}).skip(offset).limit(limit).exec());
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

function profit() {
  return new Promise((resolve, reject) => {
    try {
      resolve(
        Product.aggregate([
          {
            $match: {},
          },
          {
            $group: {
              _id: "$user",
              profit: { $sum: { $multiply: ["$price", "$quantity"] } },
            },
          },
        ])
      );
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

// Odraditi i grupisanje (može odvojena funkcija van APIa) tako da ta funkcija
// vraća za svakog korisnik moguću zaradu od proizvoda koji su dodati od
// strane konkretnog korisnika

module.exports = {
  findByName,
  findAll,
  create,
  delete: deleteProduct,
  update,
  findById,
  deleteById,
  updateById,
  dec: decProductNumber,
  inc: incProductNumber,
  numberOfProducts,
  findGroupOfProducts,
  findProductId,
  profit,
};
