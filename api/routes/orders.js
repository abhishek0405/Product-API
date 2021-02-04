const express = require('express')
const router = express.Router()
router.get('/',(req,res,next)=>{ //aldready products specified in app.js so no need again
    res.status(200).json({
        message:'Get request to orders'
    });
});

router.post('/',(req,res,next)=>{ //aldready products specified in app.js so no need again
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    };
    res.status(201).json({
        message:'post request to orders',
        order:order
    });
});

router.get('/:orderId',(req,res,next)=>{ 
    const id = req.params.orderId;
    res.status(200).json({
        message:'Get request for order  '+id
    });
});

router.post('/:orderId',(req,res,next)=>{ 
    const id = req.params.orderId;
    res.status(200).json({
        message:'Post request for order  '+id
    });
});

router.delete('/:orderId',(req,res,next)=>{ 
    const id = req.params.orderId;
    res.status(200).json({
        message:'Delte request for order '+id
    });
});

module.exports = router;