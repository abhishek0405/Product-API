const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//console.log('PASS IS',process.env.ATLAS_PASS);
const uri='mongodb+srv://abhishek:'+process.env.ATLAS_PASS+'@cluster0.dfvfh.mongodb.net/Productapp?retryWrites=true&w=majority';
mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true})
        .then(()=>console.log('CONNECTED'))
        .catch((err)=>{
            console.log('COULD NOT CONNECT');
            console.log(err);
        });
        
const productRoutes = require('./api/routes/products');//gets from module.exports there
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());//to read json from posterquests
app.use('/api//uploads//',express.static('api/uploads'));//serve static files
//CORS SETUP
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');// * means all resources.
    res.header('Access-Control-Allow-Headers','*');
    if(req.method === 'OPTIONS'){//for post requests   
        res.header('Access-Control-Allow-Methods','GET, PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});
app.use('/products',productRoutes); // anything with /products sent to product.js
app.use('/orders',orderRoutes);
app.use('/user',userRoutes);
//if reach here then no route satisfied
app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error); 
})

//whatever error redirected and  handled here
app.use((error,req,res,next)=>{
    res.status(error.status||500).json({
        error:{
            message:error.message
        }
    });
});
module.exports = app;