import { app } from "./app.js";
import { config } from "dotenv";
import { connectDataBase } from "./src/config/db.js";
import { Product } from './src/models/admin/product.model.js';
config();

const port = process.env.PORT || 8088;

connectDataBase();

app.listen(port, () => {
    console.log(`Server is running on => http://localhost:${port}`);
});



// 6,10
// 6,70
// 6,70
// 6,70
// 6,70
// 6,70
// 6,70
// 6,70
// 6,70
// 7,30
// 7,30
// 7,30
// 7,30
// 7,30
// 7,50
// 9,80
// 9,80
// 9,80
// 9,80
// 9,80
// 9,80
// 9,80
// 9,80
// 10,80
// 10,80
// 10,80
// 10,80
// 10,80
// 14,30
// 16,50
// 16,50
// 16,50
// 16,50
// 16,50
// 16,50
// 16,50
// 16,50
// 19,50
// 19,50
// 19,50
// 19,50
// 19,50
// 6,90
// 8,90
// 8,90
// 8,90
// 8,90
// 8,90
// 8,90
// 8,90
// 8,90
// 9,90
// 9,90
// 9,90
// 9,90
// 9,70
// Mini
// 24cm
// +1,00
// Medium
// 32cm
// +2,00
// Maxi
// 41cm
// +3,00
// Pan
// 28cm
// +1.50
// Mit Käserand
// Margherita
// Mit fruchtiger Tomatensauce, und zartschmelzendem käse
// Salami
// Herzhaft Rindersalami (100% Rind Chili), Käse
// Peperoniwurst
// Leckere peperoniwurst, Käse
// Schinken
// Schinken (100% Puten Schinken), Käse
// Tonno
// Thunfisch, rote Zwiebeln, Knoblauch, Käse
// Lover
// Schinken, frische Champignons, Käse
// Bayern
// Peperoniwurst, rote zwiebeln, Käse
// Hawaii
// Puten Schinken, Ananas, Käse
// Downtown
// Salami (100% Rind), Schinken, frische Champignons, Käse
// French Cheese
// Gouda, Mozzarella, Gorgonzola, Fetakäse
// City
// Puten Schinken, Rindersalami, Champignons, Käse
// Star
// Frische Paprika, rote zwiebeln, Schinken, Salami, Käse
// Wow
// Sauce Hollandaise, Broccoli, Hähnchenbrustfilet
// Slice
// Sauce Hollandaise, Hähnchenbrustfilet, Cherrytomaten,
// rote zwiebeln, Käse
// 60


// Döner
// Döner Fleisch, rote Zwiebeln, Käse, Aioli Dip
// Pizza Land
// Truthanschinken, Champignons, Käse
// Firebox
// Rote zwiebeln, 100% Rinderhackfleisch, Eier, Käse
// Moon
// Geheimnisvolle scharfe Sauce, Chili, Salami (100%
// Rind), rote Zwiebeln, schwarze Oliven, milde
// Peperoni
// Burger
// Rinderhackfleisch (100% Rind), frische Tomaten,
// Essig Gurken, rote Zwiebeln, anschließend Burger
// Sauce
// Joker
// Sauce Hollandaise, Lachs filet, Spinat, Käse
// Fresh Slice
// Salami (100% Rind), Mais, Paprika, Thunfisch,
// Jalapenos, rote Zwiebeln, Käse
// Palace
// Sauce Hollandaise, geflügelwürstchen (100%
// Geflügel), Mais
// Broadway
// Truthanschinken,100% Rindersalami, Käse
// Crispy Slices
// 100% Rindersalami, peperoniwurst,
// Truthanschinken, Käse
// Bliss
// Paprika, rote zwiebeln, Hähnchengyros, Käse
// Slice of Heaven
// Tomaten, on the top rucola, parmesan
// Extra Zutat
// 87
// 88
// 89
// 90
// 91
// 92
// 93
// 94
// 95
// 96
// 97
// 98
// 00
// 7,90
// 7,90
// 7,90
// 8,30
// 8,30
// 8,30
// 8,30
// 8,30
// 8,30
// 8,30
// 8,40
// 8,40
// +0,80
// 11,10
// 11,10
// 11,10
// 12,10
// 12,10
// 12,10
// 12,10
// 12,10
// 12,10
// 11,40
// 11,40
// 11,40
// +1,30
// 21,50
// 21,50
// 11,10
// 21,50
// 21,50
// 21,50
// 21,50
// 21,50
// 21,50
// 21,50
// 21,50
// 21,50
// +2,30
// 9,90
// 9,90
// 9,90
// 10,90
// 10,90
// 10,90
// 10,90
// 10,90
// 10,90
// 10,90
// 10,10
// 10,10
// +1,00




