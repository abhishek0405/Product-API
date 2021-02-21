const express = require('express')
const Order = require('../models/order');
const Product = require('../models/products');
const router = express.Router()
router.get('/',(req,res,next)=>{ //aldready products specified in app.js so no need again
    Order.find()
         .select("quantity product _id")
         .populate('product')// product points to the id in json response.Using populate('product','name price') we can  the specific info we need
         .exec()
         .then(order_arr=>{
             console.log('Fetched orders succesfully');
            res.status(200).json({
                message:'ALL ORDERS FETCHED SUCCESFULLY',
                order:order_arr
            })
         })
         .catch(err=>{
             console.log(err);
             res.status(500).json({
                message:'error in fetching',
                error:err
            })

         })
});

router.post('/',(req,res,next)=>{ //aldready products specified in app.js so no need again
        Product.findById(req.body.productId)
               .then(product=>{
                   console.log(product);
                if(product){
                const order = new Order({
                    quantity:req.body.quantity,
                    product:req.body.productId
                });
                return order.save();
                } else{
                    return res.status(404).json({
                        message:'PRODUCT NOT FOUND'
                    })
                }
               })
               .then(result=>{
                   console.log('Order posted succesfully');
                   res.status(201).json({
                       message:"placed order",
                       order:result
                   })

               })
               .catch(error=>{
                   console.log('err')
                   res.status(500).json({
                       message:"FAILED TO POST ORDER",
                       error:err

                   })
               })

        
    
    
});

router.get('/:orderId',(req,res,next)=>{ 
    const orderid = req.params.orderId;
    Order.findById(orderid)
    .exec()
    .then(order=>{
        if(!order){
            return res.status(404).json({
                message:"order not found"
            });
        } else{
            console.log('ORDER FOUDN');
        res.status(200).json(order);
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json(err);
    })
});

router.post('/:orderId',(req,res,next)=>{ 
    const id = req.params.orderId;
    res.status(200).json({
        message:'Post request for order  '+id
    });
});

router.delete('/:orderId',(req,res,next)=>{ 
    const id = req.params.orderId;
    Order.remove({_id:id})
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