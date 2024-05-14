import { Order } from "../../models/user/order.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import JWT from "jsonwebtoken";
import cookiesParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import ejs from "ejs";

function getDirname(importMetaUrl) {
  const __filename = fileURLToPath(importMetaUrl);
  return dirname(__filename);
}

// Example usage:
const __dirname = getDirname(import.meta.url);
console.log(__dirname);

import nodemailer from "nodemailer";
const createOrder = async (req, res) => {
  try {
    const { email, phone, address, paymentMethod, productDetails } = req.body;

    const newOrder = await Order.create(Order);

    res
      .status(201)
      .json(new ApiResponse(201, newOrder, "Order generate successfully"));
  } catch (err) {
    console.log(err);
    if (err instanceof ApiError) {
      return res
        .status(err.statusCode)
        .json(new ApiResponse(err.statusCode, null, err.message));
    } else {
      return res
        .status(500)
        .json(
          new ApiResponse(
            500,
            null,
            "Some error occurred while generating order"
          )
        );
    }
  }
};

const editOrder = async (req, res) => {
  try {
    const updatedOrderData = req.body;
    const { id } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(id, updatedOrderData);
    if (!updatedOrder) {
      throw new ApiError(404, "Order not found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, updatedOrder, `Order ${updatedOrder} successfully`)
      );
  } catch (error) {
    console.error(error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    } else {
      return res
        .status(500)
        .json(
          new ApiResponse(500, null, "Some error occurred while updating order")
        );
    }
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      throw new ApiError(404, "Order not exist");
    }

    res
      .status(200)
      .json(new ApiResponse(200, deletedOrder, "Order deleted successfully"));
  } catch (error) {
    console.error(error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    } else {
      return res
        .status(500)
        .json(
          new ApiResponse(500, null, "Some error occurred while deleting order")
        );
    }
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    res.status(200).json(new ApiResponse(200, orders, "All Orders Data"));
  } catch (error) {
    console.error(error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    } else {
      return res
        .status(500)
        .json(
          new ApiResponse(500, null, "Some error occurred while getting orders")
        );
    }
  }
};

const getSingleOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      throw new ApiError(404, "No such order exists");
    }

    res.status(200).json(new ApiResponse(200, order, "Order Data"));
  } catch (error) {
    console.error(error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    } else {
      return res
        .status(500)
        .json(
          new ApiResponse(500, null, "Some error  while getting single orders")
        );
    }
  }
};

const addToCart = async (req, res) => {
  try {
    //    console.log("🚀 ~ addToCart ~ req:", req.body);
    let { order, orderToken } = req.body;
    //  console.log("🚀 ~ addToCart ~ body:", req.body);
    //console.log("🚀 ~ addToCart ~ orderToken:", orderToken);
    console.log("The order object from user ", req.body.order)

    let totalQuantity = 1;
    let orders = [];
    let alreadyAdded = false;
    const secretKey = "hsigfsdgsfdiuuo8uw4656";
    if (orderToken != "") {
      let tokenDecode = JWT.decode(orderToken);
      //console.log("🚀 ~ addToCart ~ tokenDecode:", tokenDecode);
      tokenDecode.orders.forEach((element) => {

        if (element.productId !== order.productId) {
          let prodcuPrice = (parseFloat(element.Price) * element.Quenty).toFixed(2);
          let ProOrder = {
            productName: element.productName,
            productId: element.productId,
            category: element.category,
            description: element.description,
            Price: element.Price,
            prodcuPrice: prodcuPrice,
            Quenty: element.Quenty,
            size: element.size,
            imageSrc: element.imageSrc,
          }

          orders.push(ProOrder);

        }

        if (element.productId === order.productId && order.size !== element.size) {
          let prodcuPrice = (parseFloat(element.Price) * element.Quenty).toFixed(2);
          let ProOrder = {
            productName: element.productName,
            productId: element.productId,
            category: element.category,
            description: element.description,
            Price: element.Price,
            prodcuPrice: prodcuPrice,
            Quenty: element.Quenty,
            size: element.size,
            imageSrc: element.imageSrc,
          }

          orders.push(ProOrder);


        }
        //}
      });
    }

    console.log("The Price and quantiry of order", order.Price, " ", order.Quenty)
    let newProdcuPrice = (parseFloat(order.Price) * order.Quenty).toFixed(2);
    order.prodcuPrice = newProdcuPrice

    console.log("the new order is ", order)
    //  let newOrder = {
    //         productId:  order.productId ,
    //         category: order.category,
    //         description: order.description,
    //         Price: order.Price,
    //         prodcuPrice: newProdcuPrice,
    //         Quenty:  order.Quenty,
    //         imageSrc: order.imageSrc,
    //  }

    orders.push(order);
    console.log("The order objec becode decode", orders)
    const payload = {
      orders: orders,
      totalQuantity: totalQuantity,
    };

    const expiresIn = "5000000000000000000000000h";
    const token = JWT.sign(payload, secretKey, { expiresIn });
    //console.log("🚀 ~ addToCart ~ token:", token);

    //res.cookie("order", token);
    //res.cookie("order", token, { secure: true });
    // if (alreadyAdded) {
    //   res.status(200).json(new ApiResponse(200, token, "Quantity Updated"));
    // }

    res.status(201).json(new ApiResponse(201, token, "Order Add to Cart"));
  } catch (error) {
    console.log("The error is", error);
  }
};

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

const getCart = async (req, res) => {

  let orderToken = JWT.decode(req.body.orderToken);


  let totalQuantity = 0;
  let totalPriceOfProduct = 0;

  for (const item of orderToken.orders) {
    totalQuantity += parseInt(item.Quenty);
    totalPriceOfProduct += (parseFloat(item.Price) * parseInt(item.Quenty)); // Assuming Price is a string like '$15'
  }

  const templatePath = path.join(__dirname, "email.html");
  const templateString = fs.readFileSync(templatePath, "utf-8");

  const discountPercentage = 0.1; // 10% discount
  let total = totalPriceOfProduct;
  let totalPriceAfterDiscount =
    totalPriceOfProduct * (1 - discountPercentage);
  totalPriceAfterDiscount = totalPriceAfterDiscount
  const order = {
    fullName:req.body.fullName,
    email: req.body.email,
    address: req.body.address,
    phone: req.body.phone,
    paymentMethod: "Cash on Delivery",
    totalItem: totalQuantity,
    Subtotal: totalPriceOfProduct,
    discount: "10%",
    total: totalPriceAfterDiscount,
  };

  // Compile the HTML template with EJS
  const compiledTemplate = ejs.compile(templateString);

  // Render the template with the order data
  const html = compiledTemplate({ order: order, productDetails: orderToken });
  //console.log("🚀 ~ getCart ~ html:", html)

  // Define email options
  res
    .status(200)
    .json(new ApiResponse(200, order, "Order Placed Successfully"));
  sendEmail("danishriazprogramer@gmail.com", "Test Subject", html)
    .then(() => {
      console.log("Email sent successfully");
    })
    .catch((error) => {
      console.error("Failed to send email:", error);
    });

};

async function sendEmail(to, subject, html) {
  try {
    // Create a transporter object using the default SMTP transport
    const auth = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "danishriazprogramer@gmail.com",
        pass: "krqfoxprpntcqexy",
      },
    });

    // Send mail with defined transport object
    const message = {
      from: "jokers.palace786@gmail.com",
      to: to,
      subject: "Hi, Joker Palace You Recive New Order",
      html: html,
    };

    auth.sendMail(message, (error, emailResp) => {
      if (error) throw error;
      resp.send("emial succefull send");
    });
    //console.log('Message sent: %s', info.messageId);
    //return info.messageId;
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    throw error; // Rethrow the error to handle it outside of this function
  }
}

const getOrdersOnUserSide = async (req, res) => {
  try {
    console.log("The order body is", req.body);
    let orderToken = JWT.decode(req.body.orderToken);
    console.log("🚀 getOrdersOnUserSide: body ", orderToken);

    let totalQuantity = 0;
    let totalPriceOfProduct = 0;

    for (const item of orderToken.orders) {
      totalQuantity += parseInt(item.Quenty);
      console.log("The Total quantaty", totalQuantity);
      // Assuming Quenty is quantity
      totalPriceOfProduct += parseFloat(item.Price) * parseInt(item.Quenty).toFixed(2); // Assuming Price is a string like '$15'

    }

    const discountPercentage = 0.1; // 10% discount
    let totalPriceAfterDiscount =
      totalPriceOfProduct * (1 - discountPercentage);
    totalPriceAfterDiscount = totalPriceAfterDiscount.toFixed(2);
    totalPriceOfProduct = totalPriceOfProduct.toFixed(2);
    res.status(201).json({
      statusCode: 201,
      orderToken: orderToken,
      totalPrice: totalPriceOfProduct,
      totalQuantity: totalQuantity,
      totalPriceAfterDiscount: totalPriceAfterDiscount,
      discount: "10%",
      message: "Order generated successfully",
    });
  } catch (error) {
    console.log("🚀 ~ getOrdersOnUserSide ~ error:", error);
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
    });
  }
};

const delCartItem = async (req, res) => {
  try {


    let orderToken = JWT.decode(req.body.orderToken);
    console.log("🚀 getOrdersOnUserSide: body ", orderToken);

    let responce = []
    orderToken.forEach(element => {
      if (element.productId === req.body.id) {

      } else {
        responce.push(element)
      }
    });

    let length = responce.length
    const payload = {
      orders: responce,
      totalQuantity: length,
    };


    const expiresIn = "5000000000000000000000000h";
    const token = JWT.sign(payload, secretKey, { expiresIn });


    res.status(201).json(new ApiResponse(201, token, "Order Add to Cart"));

  } catch (error) {

  }
}

export {
  createOrder,
  editOrder,
  deleteOrder,
  getOrders,
  getSingleOrders,
  addToCart,
  getCart,
  getOrdersOnUserSide,
  delCartItem,
};



/// sudo certbot --nginx -d jokerpalace.de -d www.jokerpalace.de
//  app.use(cors({
//   // origin: true,
//   credentials: true
//   }));
