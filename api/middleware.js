const MongoClient = require('mongodb').MongoClient

let db;
let Products;

MongoClient.connect("mongodb://localhost:27017/db", { useUnifiedTopology: true },(err, client) => {
    if (err) return console.error(err)
    console.log('Connected')
    db = client.db('db')
    Products = db.collection('Products')
});

const isNameValid = (name) => {
    if (name.length <=1 && name[0]!=' ') {
        return false;
    }
    return true;
}

const isIdValid = (num) => {
    var regex = /^[0-9]{13}$/;
    return regex.test(num);
}

const isRequired = (value) => {
    return value === '' || value == 0||value ==null ? false : true;
}

const checkIdProduct = (idValue) => {
    if (isRequired(idValue)&&(!isIdValid(idValue))) {
        return "בר-קוד לא חוקי"
    }
    return null;
}

const checkName = (nameValue) => {
    if (isRequired(nameValue)&&(!isNameValid(nameValue))) {
        return "שם לא חוקי"
    }
    return null;
}

exports.validSearchValue=(req, res, next) => {
    let errorSearchValue=null;
    if (req.query._id){
        errorSearchValue = checkIdProduct(req.query._id);
    }
    else if (req.query.name){
        errorSearchValue= checkName(req.query.name);
    }
    else if (req.query.supplier){
        errorSearchValue = checkName(req.query.supplier);
    }
    if (errorSearchValue != null) {
        return res.json(errorSearchValue)
    }
    else {
        next();
    }
}

exports.validIdProduct=(req, res, next) => {
    let errorId=null;
    if (req.query._id){
        errorId = checkIdProduct(req.query._id);
    }
    if (errorId != null) {
        return res.send(errorId)
    }
    else {
        next();
    }
}

