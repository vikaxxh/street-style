const Order = require('../Models/orderModel')
const Product = require('../Models/ProductsModel')
const ErrorHandler = require('../utils/errorhanddler')
const asyncWrapper = require('../middleware/async')

exports.newOrder = asyncWrapper(
    async(req, res, next)=>{

        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body

        const order = await Order.create({
             shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            user:req.user.id
        })

        res.status(201).json({
            success: true,
            order
        })
    }
)

exports.getSingleOrder = asyncWrapper(
    async(req, res,next)=>{
        const order = await Order.findById(req.params.id).populate("user", "name email")

        if(!order){
            return next(new ErrorHandler("order not found with this Id", 404))
        }

        res.status(200).json({
            success: true,
            order
        })
    }
)


exports.myOrders = asyncWrapper(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    orders,
  });
});


exports.getAllOrders = asyncWrapper(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;

  orders.forEach(order =>{
      totalAmount += order.totalPrice;
  })

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});


exports.updateOrder = asyncWrapper(async (req, res, next) => {

  const order = await Order.findById(req.params.id);
  
   if(!order){
        return next(new ErrorHandler("order not found with this Id", 404))
        }

  if(order.orderStatus === 'Delivered'){
      return next(new ErrorHandler("You have already delivered this order", 400))
  }

  order.orderItems.forEach( async (order) =>{
      await updateStock(order.product,order.quantity)
  })
 
  order.orderStatus = req.body.status;
  if(req.body.status ==="Delivered"){
      order.deliveredAt = Date.now()
  }

  await order.save({validateBeforeSave: false});

  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity){
  const product = await Product.findById(id);
  product.stock-= quantity
   await  product.save({validateBeforeSave: false})
}

exports.deleteOrder = asyncWrapper(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("order not found with this Id", 404))
        }

  await order.remove()
  res.status(200).json({
    success: true,
    
  });
});
