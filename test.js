import axios from "axios";
import { configDotenv } from "dotenv";
configDotenv();
import JWT from "jsonwebtoken";

// console.log("the base url is ", process.env.SENDBOX_URL);
// console.log("the APP_CLIENT_ID is ", process.env.APP_CLIENT_ID);
// console.log("the SECRET_KEY is ", process.env.SECRET_KEY);

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

  console.log("The access token is ", response.data.access_token);
  return response.data.access_token;
}

// const accessToken = await generateAccessToken();
// console.log("🚀 ~ createOrder ~ accessToken:", accessToken);
export const createOrder = async (order, totalQuantity, totalPrice) => {
  console.log("this is testing");
  //   console.log("🚀 ~ createOrder ~ order:", order);
  //   console.log("🚀 ~ createOrder ~ totalQuantity:", totalQuantity);
  //   console.log("🚀 ~ createOrder ~ totalPrice:", totalPrice);

  //   let paypalOrder = [];
  //   order.orders.forEach((element) => {
  //     //console.log("🚀 ~ createOrder ~ element:", element);

  //     let orders = {
  //       name: element.productName,
  //       description: element.description,
  //       quantity: element.Quenty,
  //       unit_amount: {
  //         currency_code: "USD",
  //         value: element.Price,
  //       },
  //     };
  //     paypalOrder.push(orders);
  //   });

  console.log("🚀 ~ order.orders.forEach ~ paypalOrder:", paypalOrder);
  let accessToken1 =
    "A21AAIxxltigtvI2SuIE2HPK5rYGjjndVfUWbm1yHWtsKx4u8Gm5Ld_ePbV5j1a01sPjwBG4sb-v-xUR008-bSp1cN467HNIg";
  console.log("🚀 ~ createOrder ~ accessToken:", accessToken1);
  const response = await axios({
    url: process.env.SENDBOX_URL + "/v2/checkout/orders",
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken1,
    },
    data: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          items: [
            {
              name: "Node.js Complete Course",
              description: "Node.js Complete Course with Express and MongoDB",
              quantity: 1,
              unit_amount: {
                currency_code: "USD",
                value: "100.00",
              },
            },
            {
              name: "Node.js Complete Course",
              description: "Node.js Complete Course with Express and MongoDB",
              quantity: 1,
              unit_amount: {
                currency_code: "USD",
                value: "100.00",
              },
            },
            {
              name: "Node.js Complete Course",
              description: "Node.js Complete Course with Express and MongoDB",
              quantity: 1,
              unit_amount: {
                currency_code: "USD",
                value: "100.00",
              },
            },
          ],

          amount: {
            currency_code: "USD",
            value: "300.00",
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: "300.00",
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
  //console.log("The response is ", response);
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
    //console.log("The payment function body is:  ", req.body);

    let orderToken = JWT.decode(req.body.orderToken);

    let totalQuantity = 0;
    let totalPriceOfProduct = 0;
    for (const item of orderToken.orders) {
      totalQuantity += parseInt(item.Quenty);
      totalPriceOfProduct += parseFloat(item.Price);
    }

    const discountPercentage = 0.1;
    let total = totalPriceOfProduct.toFixed(2);
    let totalPriceAfterDiscount =
      totalPriceOfProduct * (1 - discountPercentage).toFixed(2);
    //    console.log("🚀 getOrdersOnUserSide: body ", orderToken);
    // console.log(
    //   "🚀 ~ getpayment ~ totalPriceAfterDiscount:",
    //   totalPriceAfterDiscount
    // );
    // console.log("🚀 ~ getpayment ~ total:", total);

    const url = await createOrder(
      orderToken,
      totalQuantity,
      totalPriceAfterDiscount
    );
    console.log("🚀 ~ getpayment ~ url:", url);
    await res.redirect(url);
  } catch (error) {
    res.send("Error: " + error);
  }
};

export { getpayment };
