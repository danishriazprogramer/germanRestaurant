import { Router } from 'express';
import {
  createOrder,
  deleteOrder,
  editOrder,
  getOrders,
  getSingleOrders,
  addToCart,
  getCart,
  getOrdersOnUserSide,
  delCartItem,
  getDealName,
} from '../../controllers/user/order.controller.js';

const router = new Router();

router.post('/createOrder', createOrder);
router.put('/editOrder/:id', editOrder);
router.delete('/deleteOrder/:id', deleteOrder);
router.get('/getOrders', getOrders);
router.get('/getOrders/:id', getSingleOrders);
router.post('/addToCart', addToCart);
router.post('/getCart', getCart);
router.post('/getOrdersOnUserSide', getOrdersOnUserSide);
router.post("/delCartItem",delCartItem);
router.get("/getDealName",getDealName)

export default router;
