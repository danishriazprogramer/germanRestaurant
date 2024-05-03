import { Order } from '../../models/user/order.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import JWT from "jsonwebtoken"
import cookiesParser from "cookie-parser"

import nodemailer from "nodemailer"
const createOrder = async (req, res) => {
  try {
    const { email, phone, address, paymentMethod, productDetails } = req.body;

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


const addToCart = async (req, res) => {
  try {
    console.log("🚀 ~ addToCart ~ req:", req.body);
    let { order, orderToken } = req.body;
    //console.log("🚀 ~ addToCart ~ body:", req.body);
    //console.log("🚀 ~ addToCart ~ orderToken:", orderToken);

    let totalQuantity = 1;
    let orders = []
    let alreadyAdded = false;
    const secretKey = 'hsigfsdgsfdiuuo8uw4656';
    if (orderToken != "") {
      let tokenDecode = JWT.decode(orderToken)
      tokenDecode.orders.forEach(element => {
        if (element.productId === order.productId) {
          alreadyAdded = true
          console.log("the alllreadyadded is ruing ")
        } else {
          totalQuantity = totalQuantity + parseInt(element.Quenty)
          orders.push(element)
        }

      });
    }


    orders.push(order)
    const payload = {
      orders: orders,
      totalQuantity: totalQuantity
    };


    const expiresIn = '5000000000000000000000000h';
    const token = JWT.sign(payload, secretKey, { expiresIn });

    res.cookie("order", token);
    if (alreadyAdded) {
      res.status(200).json(new ApiResponse(200, token, 'Food is already Added'));
    }
    res.status(201).json(new ApiResponse(201, token, 'Order Add to Cart'));

  } catch (error) {
    console.log("The error is", error)
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

const getCart = async (req, res) => {
  console.log("The order body is", req.body);
  let orderToken = JWT.decode(req.body.orderToken);
  console.log("🚀 ~ getCart ~ orderToken:", orderToken);
  let obj
  if (orderToken) {
    let totalQuantity = 0;
    let totalPrice = 0;

    for (const item of orderToken.orders) {
      totalQuantity += parseInt(item.Quenty); // Assuming Quenty is quantity
      totalPrice += parseFloat(item.Price.slice(1)); // Assuming Price is a string like '$15'
    }

     obj = new Order({
      email: req.body.email,
      address: req.body.address,
      phone: req.body.phone,
      paymentMethod: req.body.paymentMethod,
      productDetails: orderToken.orders, // Assuming orderToken has an array named orders
      totalQuantity: totalQuantity,
      totalPrice: totalPrice,
    });

    await obj.save();
  }
  res.send(obj);

  function sendingEmails() {

    return {
        async sendingEmails(req, resp) {

            const auth = nodeMailer.createTransport({
                service: "gmail",
                auth: {
                    user: "danishriazprogramer@gmail.com",
                    pass: "krqfoxprpntcqexy"
                }
            })

            const mails = ["engineralihassan@gmail.com", "danishriazprogramer@gmail.com"];

            for (i = 0; i < mails.length; i++) {

                const message = {
                    from: "danishriazprogramer@gmail.com",
                    to: mails[i],
                    subject: "Email testing for MarrayMe",
                    html: "<h1>This is html tag</h1>"
                }

                auth.sendMail(message, (error, emailResp) => {
                    if (error)
                        throw error
                    resp.send("emial succefull send");


                })
            }
        }
    }
}


async function sendEmail(to, subject, text) {
  try {
    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'danishriazprogramer@gmail.com', // Your email username
        pass: 'krqfoxprpntcqexy', // Your email password
      },
    });

    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'danishriazprogramer@gmail.com', // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      // html: '<b>Hello world?</b>', // html body (you can use this for HTML content)
    });

    console.log('Message sent: %s', info.messageId);
    return info.messageId;
  } catch (error) {
    console.error('Error occurred while sending email:', error);
    throw error; // Rethrow the error to handle it outside of this function
  }
}

// Example usage
sendEmail('danishriazprogramer@gmail.com', 'Test Subject', 'This is a test email from Node.js and hostinger server ')
  .then(() => {
    console.log('Email sent successfully');
  })
  .catch((error) => {
    console.error('Failed to send email:', error);
  });


};


export { createOrder, editOrder, deleteOrder, getOrders, getSingleOrders, addToCart, getCart };