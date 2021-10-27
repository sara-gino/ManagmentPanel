'use strict'

var app = module.exports = require('express')();
var bodyParser = require('body-parser');
var cors = require('cors');
const { create } = require('node-cookie');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
var port = process.env.port || 5000;
const MongoClient=require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/ProductDb",function(err,db){
  if(err) {
  throw err;
  console.log(err)
}});

app.use('/', require('./ProductRouter.js'));

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});


app.listen(port, () => {
  console.log('server run');
});

