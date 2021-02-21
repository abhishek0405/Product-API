const express = require('express')
const mongoose = require('mongoose');
const Product = require('../models/products'); // the product model
const router = express.Router();

const multer = require('multer');
/*const storage = multer.diskStorage({
    destination:function(req,file,cb){ //cb is call back
        console.log("check1");
        cb('null','./uploads'); // null to say that no error.
        console.log('loc found');
    },
    filename:function(req,file,cb){
        console.log("check2");
        cb(null,file.originalname);//console.log file and choose how you want the name to be(use original name to store in jpg type format)
    }
})*/
const storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'api/uploads') 
    }, 
    filename: (req, file, cb) => { 
        
        cb(null, file.originalname); 
    } 
}); 
//to ensure only specific files allowed
const fileFilter = (req,file,cb)=>{
    //reject file
    if(file.mimetype==='image/jpeg'||file.mimetype==='image/png'){
        cb(null,true);//true to save
    } 
    else{
        cb(new Error('Upload only jpeg or png files!!'),false);//false to reject the file
    }
}
const upload = multer({storage:storage,limits:{
    fileSize:1024*1024*5 //in bytes hence 1024 *1024 is 1MB. Do 1MB *(number of mbs needed max limit)
},
 fileFilter:fileFilter
});

router.get('/',(req,res,next)=>{ //aldready products specified in app.js so no need again
    Product.find()
           .select("name price _id productImage") //separate with space only these attris taken now
           .exec()
           .then(docs=>{
               //docs is an array of objects
               console.log(docs);
               const send_result = {
                   count:docs.length,
                   products:docs.map(doc=>{
                       
                    return {
                        name:doc.name,
                        price:doc.price,
                        _id:doc._id,
                        productImage:doc.productImage,
                        request:{
                            type:"GET",
                            url:'http://localhost:3000/products/'+doc._id
                        }
                    }
                   })
               }
               res.status(200).json({
                   message:'Succesfully Fetched products',
                   details:send_result
               })
           })
           .catch(err=>{
               console.log(err);
               res.status(500).json({
                   message:'Failed to fetch data',
                   error:err
               })
           })
});

router.post('/',upload.single('productImage'),(req,res,next)=>{ //aldready products specified in app.js so no need again
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price,
        productImage:req.file.path
    })// create product instance of Product type
    product.save() 
           .then(result=>{
               console.log('Succesfully saved');
               const createdProduct = {
                   name : result.name,
                   price:result.price,
                   _id:result._id,
                   request:{
                       type:'GET',
                       url:'http://localhost:3000/products/'+result._id
                   }
               }
               res.status(201).json({
                message:'SUCCESFUL POST REQUEST',
                createdProduct:createdProduct
            });
           })
           .catch(err=>{
               console.log(err);
               res.status(500).json({
                message:'FAILED POST REQUEST',
                createdProduct:product,
                error:err
            });
           })

    //CODE HERE IS DONE IMMEDIATELY BEFORE THE ABOVE PROMISE BEING COMPLETED SO RETURNING JSON RESPONSE CAN BE DONE INSIDE THE .then()
    
});

router.get('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    Product.findById(id)
           .exec()
           .then(doc =>{
               console.log(doc);
               if(doc){
                res.status(200).json(doc);
               } else{
                   res.status(404).json({'message':'No valid entry for the given product id'})
               }
               
           })
           .catch(err=>{
               console.log(err);
               res.status(500).json({error:err});
           });
})

router.patch('/:productId',(req,res,next)=>{ //aldready products specified in app.js so no need again
    const productId = req.params.productId;
    const updateOps={};
    //req.body will return an array in this case like [{"propname":"name","value":"NEWPRODUCTNAME"},{"propname":"price",value:"NEWVALUE"}]
    for (const it of req.body){
        updateOps[it.propName] = it.value;
    }
    Product.updateOne({_id:productId},{$set:updateOps})
           .exec()
           .then(result=>{
               console.log('Succesfully updated');
               res.status(200).json({
                   message:"Updated Succesfully",
                   result:result
               });
           })
           .catch(err=>{
               console.log('error while updating')
               res.status(500).json({
                   message:'ERROR WHILE UPDATING',
                   error:err
               });
           });
});

router.delete('/:productId',(req,res,next)=>{ //aldready products specified in app.js so no need again
    const id = req.params.productId;
    Product.remove({_id:id})
           .exec()
           .then(result=>{
               console.log('DELETED SUCCESFULLY');
               res.status(200).json({
                   message:'DELETED SUCCESFULLY',
                   result:result
               })

           })
           .catch(err=>{
               console.log(err);
               res.status(500).json({
                   message:'Error while deleting',
                   error:err
               })
           })

});


module.exports = router;