import { Order } from '../../models/user/order.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import JWT from "jsonwebtoken"
import cookiesParser from "cookie-parser"
const createOrder = async (req, res) => {
  try {
    const {email,phone,address,city,username,paymentMethod,productDetails} = req.body;
    
    const newOrder = await Order.create(Order);

    res.status(201).json(new ApiResponse(201, newOrder, 'Order generate successfully'));
  } catch (err) {
    console.log(err);
    if (err instanceof ApiError) {
      return res
        .status(err.statusCode)
        .json(new ApiResponse(err.statusCode, null, err.message));
    } else {
      return res
        .status(500)
        .json(new ApiResponse(500, null, 'Some error occurred while generating order'));
    }
  }
};

const editOrder = async (req, res) => {
  try {
    const updatedOrderData = req.body;
    const { id } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(id, updatedOrderData);
    if (!updatedOrder) {
      throw new ApiError(404, 'Order not found');
    }

    res
      .status(200)
      .json(new ApiResponse(200, updatedOrder, `Order ${updatedOrder} successfully`));
  } catch (error) {
    console.error(error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    } else {
      return res
        .status(500)
        .json(new ApiResponse(500, null, 'Some error occurred while updating order'));
    }
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      throw new ApiError(404, 'Order not exist');
    }

    res
      .status(200)
      .json(new ApiResponse(200, deletedOrder, 'Order deleted successfully'));
  } catch (error) {
    console.error(error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    } else {
      return res
        .status(500)
        .json(new ApiResponse(500, null, 'Some error occurred while deleting order'));
    }
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    res.status(200).json(new ApiResponse(200, orders, 'All Orders Data'));
  } catch (error) {
    console.error(error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    } else {
      return res
        .status(500)
        .json(new ApiResponse(500, null, 'Some error occurred while getting orders'));
    }
  }
};

const getSingleOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      throw new ApiError(404, 'No such order exists');
    }

    res.status(200).json(new ApiResponse(200, order, 'Order Data'));
  } catch (error) {
    console.error(error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    } else {
      return res
        .status(500)
        .json(new ApiResponse(500, null, 'Some error  while getting single orders'));
    }
  }
};


const addToCart = async (req,res)=>{
  try {
  //console.log("the body of order is:",req.body)
  let {order,orderToken} = req.body;
  console.log("🚀 ~ addToCart ~ order:", order)
  let totalQuantity = 1;
  let orders = []
  const secretKey = 'hsigfsdgsfdiuuo8uw4656';
  if(orderToken != ""){
    let tokenDecode = JWT.decode(orderToken)
    console.log("🚀 ~ addToCart ~ tokenDecode:", tokenDecode)
    tokenDecode.orders.forEach(element => {
      if(element.productId === order.productId ){
        res.status(200).json(new ApiResponse(200,'FOOD IS ALREADY ADDED'));
      }
      totalQuantity = totalQuantity +  parseInt(element.Quenty)
      console.log("🚀 ~ addToCart ~ element:", element)
      orders.push(element)
    });
  }  
  
  orders.push(order)
  //console.log("THE Decode Token is:",tokenDecode)
  const payload = {
     orders: orders,
     totalQuantity: totalQuantity
    };
    
l    
    const token = JWT.sign(payload, secretKey, { expiresIn });
    
   // console.log('Generated JWT:', token);

    res.cookie("order", token);
    res.status(200).json(new ApiResponse(200,'Order addtocart',token));
    
    
  } catch (error) {
    console.log("The error is",error)
  }
}

// const editCart = async (req,res)=>{
//   try {
//   //console.log("the body of order is:",req.body)
//   let {order,orderToken} = req.body;
//   console.log("🚀 ~ addToCart ~ order:", order)
//   let totalQuantity = 1;
//   let orders = []
//   const secretKey = 'hsigfsdgsfdiuuo8uw4656';
//   if(orderToken != ""){
//     let tokenDecode = JWT.decode(orderToken)
//     console.log("🚀 ~ addToCart ~ tokenDecode:", tokenDecode)
//     tokenDecode.orders.forEach(element => {
//       if(element.productId === order.productId ){
//         res.status(200).json(new ApiResponse(200,'FOOD IS ALREADY ADDED'));
//       }
//       totalQuantity = totalQuantity +  parseInt(element.Quenty)
//       console.log("🚀 ~ addToCart ~ element:", element)
//       orders.push(element)
//     });
//   }  
  
//   orders.push(order)
//   //console.log("THE Decode Token is:",tokenDecode)
//   const payload = {
//      orders: orders,
//      totalQuantity: totalQuantity
//     };
    
//     const expiresIn = '5000h';
    
//     const token = JWT.sign(payload, secretKey, { expiresIn });
    
//    // console.log('Generated JWT:', token);

//     res.cookie("order", token);
//     res.status(200).json(new ApiResponse(200,'Order addtocart',token));
    
    
//   } catch (error) {
//     console.log("The error is",error)
//   }
// }

// getCart

const getCart = async(req,res)=>{
let orderToken = JWT.decode(req.body.orderToken)
   console.log("🚀 ~ getCart ~ orderToken:", orderToken)
   res.send(orderToken)
}
export { createOrder, editOrder, deleteOrder, getOrders, getSingleOrders,addToCart,getCart };
