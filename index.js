import { app } from "./app.js";
import { config } from "dotenv";
import { connectDataBase } from "./src/config/db.js";
import { Product } from "./src/models/admin/product.model.js";
config();

const port = process.env.PORT ||8080;

connectDataBase();

app.listen(port, () => {
  console.log(`Server is running on => http://localhost`);
});
