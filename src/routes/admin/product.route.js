import { Router } from 'express';
import {
  createProduct,
  allProducts,
  singleProduct,
  updateProduct,
  deleteProduct,
  getOrders,
} from '../../controllers/admin/product.controller.js';
import { fileUpload } from '../../middlewares/multer.js';
const router = Router();

router.post('/addProduct',fileUpload, createProduct);
router.get('/getProducts', allProducts);

router.get('/getProducts/:id', singleProduct);
router.put('/editProduct/:id',fileUpload, updateProduct);
router.delete('/removeProduct/:id', deleteProduct);
router.get("getOrders", getOrders)

export default router;
