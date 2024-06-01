import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import axios from "axios";
const app = express();

// EJS VIEWS Rendering
app.set("views", "views");
app.set("view engine", "ejs");

// Routes Imports
import authRoutes from "././src/routes/auth.route.js";
import productRoutes from "./src/routes/admin/product.route.js";
import orderRoutes from "./src/routes/user/order.route.js";
import categoryRoutes from "./src/routes/admin/category.route.js";
import { Product } from "./src/models/admin/product.model.js";
import payment from "./src/routes/payment/payment.js";

// App Middlewares
app.use("/", express.static("public"));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:8080', // or '*' to allow all origins
}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080'); // or '*'
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.render("client/index");
});

app.get("/api/admin", (req, res) => {
  res.render("admin/index");
});

app.get("/api/menu", (req, res) => {
  res.render("client/menu");
});

app.get("/api/admin/product", (req, res) => {
  res.render("admin/products/index");
});

app.get("/api/admin/product/create", (req, res) => {
  res.render("admin/products/create");
});

app.get("/api/admin/product/get/:id", async (req, res) => {
  const { id } = req.params;
  const data = await Product.findById(id);
  res.render("admin/products/update", { data });
});

app.post("/api/admin/product/update/:id", async (req, res) => {
  console.log("🚀 ~ app.post ~ req:", req);
  const { id } = req.params;
  console.log("🚀 ~ app.post ~ id:", id);
  const name = req.body.LOVE;
  console.log(name);
  console.log("🚀 ~ app.post ~ body:", name);
  let data = await Product.findByIdAndUpdate(id);
  console.log("🚀 ~ app.post ~ data:", data);
  data = body;
  await data.save();
  //   res.render('admin/products/update', { data });
  res.send("OK HAI SUB");
});

// Route Middlewares
app.use("/api/auth", authRoutes);
app.use("/api/admin", productRoutes);
app.use("/api/user", orderRoutes);
app.use("/api/category", categoryRoutes);
app.use("/payment", payment);

// app.get("/", (req, res) => {
//   res.send("Hello, world!");
// });
app.get("/api/cart", async (req, res) => {
  res.render("client/cart");
});
app.post("/api/user/webhook", async (req, res) => {
  console.log("The webHook is runing");
  req.body;
  //
   
  console.log("🚀 ~ app.post ~ body:", req.body);
  res.send(req.body);
});


app.get("/complete-order", (req, res) => {
  console.log("The body of paypal is success responce is  ",req.query.PayerID)
  res.render("client/success",{PayerID:req.query.PayerID})
//  res.send("Complete Order Successful");
});

app.get("/cancel-order", (req, res) => {
  res.send("cancel Order");
});

export { app };

