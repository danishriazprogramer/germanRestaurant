import { app } from "./app.js";
import { config } from "dotenv";
import { connectDataBase } from "./src/config/db.js";
import { Product } from './src/models/admin/product.model.js';
config();

const port = process.env.PORT;

connectDataBase();

app.listen(port,() => {
    console.log(`Server is running on => http://localhost`);
});
app.get("/", (req, res) => {
    res.send("This is Testing root");
  });

// <% order.productDetails.forEach(function(product) { %>
//     <tr>
//         <td><%= product.productName %></td>
//         <td><%= product.Price %></td>
//         <td><%= product.Quenty %></td>
//     </tr>
//     <% }); %>
   