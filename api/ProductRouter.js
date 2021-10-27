'use strict'
//rows 3 and 18 run for the first time to load the data from the Json file to Mongo
let jsonData = require('./Items.json');
const express = require("express");
let router = express.Router()
var validation = require('./middleware')

const MongoClient = require('mongodb').MongoClient

let ProductDb;
let Products;

MongoClient.connect("mongodb://localhost:27017/ProductDb", { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected')
    ProductDb = client.db('ProductDb')
    Products = ProductDb.collection('Products');
    Products.insertMany(jsonData);
});

//get product by search key:name / _id / supplier
//query:search key:name / _id / supplier 

router.get('/', validation.validSearchValue, (req, res) => {
    let KeySearch = Object.keys(req.query)[0]
    let ValSearch = req.query[KeySearch]
    if (KeySearch == "_id") ValSearch = parseInt(ValSearch)
    if (ValSearch) {
        Products.find({ [KeySearch]: ValSearch }).toArray()
            .then(result => {
                if (result.length === 0 || !result) {
                    return res.json("לא נמצא ערך מתאים לחיפוש");
                }
                res.send(result);
            })
            .catch(error => console.error(error))
    }
    else {
        Products.find().toArray()
            .then(result => {
                return res.send(result);
            })
            .catch(error => console.error(error))
    }
});

//update price and newPrice product
//body: price,newPrice
//parems:_id 

router.put("/:_id", validation.validIdProduct, (req, res) => {
    Products.findOneAndUpdate({ "_id": parseInt(req.params._id) },
        {
            $set: {
                price: req.body.price,
                newPrice: req.body.newPrice
            }
        })
        .then(result => {
            if (!result) {
                return res.json("לא נמצא ערך מתאים לחיפוש");
            }
            res.send(result);
        })
        .catch(error => console.error(error))
});
module.exports = router

