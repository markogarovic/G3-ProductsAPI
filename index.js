const express = require('express')
const { json, urlencoded } = require('body-parser')

//const User = require('./controllers/users');
const Product = require('./controllers/products');
const { connect } = require('./helpers')
const { DB_URL } = require("./config")

const app = express()
app.use(urlencoded({ extended: true }))
app.use(json())

app.get('/product/:name', async (req, res) => {
    const productName = req.params.name;
    try{
        const product = await Product.findByName(productName);
        res.status(200).json(product);
    } catch (error) {
        res.json(error)
    }
})
app.delete('/product/:name', async (req, res) => {
    const productName = req.params.name;
    try{
        const product = await Product.delete({name:productName});
        res.status(202).json(product);
    } catch (error) {
        res.json(error)
    }
})
app.put('/product/:name', async (req, res) => {
    const productName = req.params.name;
    
    const queryToUpdate = req.body;
    try{
        const product = await Product.update({name:productName}, queryToUpdate);
        res.status(203).json(product);
    } catch (error) {
        res.json(error)
    }
})
app.post('/product', async (req, res) => {
    const productToCreate = req.body;
    try {
        const product = await Product.create(productToCreate)
        res.status(201).json(product)
    } catch (error) {
        res.json(error)
    }
})
app.get('/products', async (req, res) => {
    try{
        const products = await Product.findAll();
        res.status(200).json(products)
    } catch (error) {
        res.json(error)
    }
})



connect(DB_URL)
  .then(() => app.listen(5000, () => {
    console.log('server on http://localhost:5000')
  }))
  .catch(e => console.error(e))