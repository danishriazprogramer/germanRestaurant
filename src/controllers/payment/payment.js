import axios from "axios";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { configDotenv } from "dotenv";
configDotenv();
import JWT from "jsonwebtoken";

async function generateAccessToken() {
  const response = await axios({
    url: process.env.SENDBOX_URL + "/v1/oauth2/token",
    method: "post",
    data: "grant_type=client_credentials",
    auth: {
      username: process.env.APP_CLIENT_ID,
      password: process.env.SECRET_KEY,
    },
  });

  //   console.log("The access token is ", response.access_token);
  return response.data.access_token;
}

export const createOrder = async (order, totalPrice) => {
  // console.log("this is testing");
  console.log("🚀 ~ createOrder ~ order:", order);
  // console.log("🚀 ~ createOrder ~ totalQuantity:", totalQuantity);
  console.log("🚀 ~ the type of order is", typeof totalPrice);
  totalPrice = totalPrice.toFixed(2);
  console.log("🚀 ~ the type of order is", typeof totalPrice);
  console.log("toal proice is ", totalPrice);
  let paypalOrder = [];
  order.forEach((element) => {
    //console.log("🚀 ~ createOrder ~ element:", element);
    totalPrice = parseFloat(totalPrice).toFixed(2);
    let orders = {
      name: element.productName,
      description: element.description,
      quantity: "1",
      unit_amount: {
        currency_code: "USD",
        value: element.Price,
      },
    };
    paypalOrder.push(orders);
  });

  //console.log("🚀 ~ order.forEach ~ paypalOrder:", paypalOrder);

  const accessToken = await generateAccessToken();
  const response = await axios({
    url: process.env.SENDBOX_URL + "/v2/checkout/orders",
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    data: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          items: paypalOrder,
          amount: {
            currency_code: "USD",
            value: totalPrice,
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: totalPrice,
              },
            },
          },
        },
      ],

      application_context: {
        return_url: process.env.BASE_URL + "/complete-order",
        cancel_url: process.env.BASE_URL + "/cancel-order",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
        brand_name: "manfra.io",
      },
    }),
  });
  console.log("The response is ", response.message);
  return response.data.links.find((link) => link.rel === "approve").href;
};

export const capturePayment = async (orderId) => {
  const accessToken = await generateAccessToken();

  const response = await axios({
    url: process.env.SENDBOX_URL + `/v2/checkout/orders/${orderId}/capture`,
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });

  return response.data;
};

const getpayment = async (req, res) => {
  try {
    // console.log("The payment function body is:  ", req.body);
    const discountPercentage = 0.1;

    let orderToken = JWT.decode(req.body.orderToken);
    //console.log("🚀 ~ getpayment ~ orderToken:", orderToken);

    let totalQuantity = 0;
    let totalPriceOfProduct = 0;

    let arrayForPaypal = [];
    for (const item of orderToken.orders) {
      //console.log("🚀 ~ getpayment ~ item:", item);
      totalQuantity += parseInt(item.Quenty);
      item.Price = (
        parseFloat(item.Price) *
        parseInt(item.Quenty) *
        (1 - discountPercentage)
      ).toFixed(2);
      // console.log("The price is " + item.Price);
      totalPriceOfProduct =
        parseFloat(totalPriceOfProduct) + parseFloat(item.Price);
        totalPriceOfProduct.toFixed(2)
      arrayForPaypal.push(item);
    }

    console.log("The array for paypal ", arrayForPaypal);
    const createOrderPromise = new Promise((resolve, reject) => {
      createOrder(arrayForPaypal, totalPriceOfProduct)
        .then((url) => {
          resolve(url);
        })
        .catch((error) => {
          reject(error);
        });
    });

    // Wait for the promise to resolve
    const data = await createOrderPromise;
    console.log("🚀 ~ getpayment ~ data:", data)

    res.status(200).json(new ApiResponse(200, data, "The paypal url is "));
  } catch (error) {
    console.log("🚀 ~ getpayment ~ error:", error);
    res.send("Error: " + error);
  }
};

export { getpayment };
