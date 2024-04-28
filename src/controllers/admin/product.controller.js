import { Product } from '../../models/admin/product.model.js';
import { Order } from "../../models/user/order.model.js";
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import fs from "fs"
//import fil from "../../../products.json"
const createProduct = async (req, res) => {
  try {
    const { name, unitPrice, description, category, imageUrl, size, discount } = req.body;

    if (!name || !unitPrice || !description) {
      throw new ApiError(400, 'All fields are required');
    }

    const productData = {
      name,
      unitPrice,
      description,
      category,
      imageUrl,
      size,
      discount,
    };
    productData.imageUrl = req.file.filename || '';
    const newProduct = await Product.create(productData);
    res
      .status(201)
      .json(new ApiResponse(201, newProduct, 'Product created successfully'));
  } catch (err) {
    console.log(err);
    if (err instanceof ApiError) {
      return res
        .status(err.statusCode)
        .json(new ApiResponse(err.statusCode, null, err.message));
    } else {
      return res
        .status(500)
        .json(new ApiResponse(500, null, 'Some error occurred while creating product'));
    }
  }
};

const allProducts = async (req, res) => {
  try {
    console.log("The catoury name is:",req.query.tabName)
    if(req.query.tabName===undefined){
      const products = await Product.find();

      res.status(200).json(new ApiResponse(200, products, 'Product Data'));
    }else{
      const products = await Product.find({"category":req.query.tabName});

    res.status(200).json(new ApiResponse(200, products, 'Product Data'));
    }
    
    
  } catch (err) {
    console.log(err);
    throw new ApiError(500, 'Some error occurred while getting products');
  }
};

const getCategoires = async (req, res) => {
  try {    
    const products = await Product.find();

    const categories = products.map(product => product.category);

    const uniqueCategories = [...new Set(categories)];

    console.log("🚀 ~ getCategoires ~ uniqueCategories:", uniqueCategories);

    res.status(200).json(new ApiResponse(200, uniqueCategories, 'All Caregoires'));
  } catch (err) {
    console.log(err);
    throw new ApiError(500, 'Some error occurred while getting products');
  }
};


const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params);
    const product = await Product.findById(id);
    if (!product) {
      throw new ApiError(404, 'No such product found');
    }

    res.status(200).json(new ApiResponse(200, product, 'Product Data'));
  } catch (err) {
    console.log(err);
    if (err instanceof ApiError) {
      return res
        .status(err.statusCode)
        .json(new ApiResponse(err.statusCode, null, err.message));
    } else {
      return res
        .status(500)
        .json(new ApiResponse(500, null, 'Some error occurred while fetching product'));
    }
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, unitPrice, description, imageUrl, category, size } = req.body;

    const updateData = {
      name,
      unitPrice,
      category,
      imageUrl,
      description,
      size,
    };
    console.log('🚀 ~ updateProduct ~ updateData:', req.body);
    updateData.imageUrl = req.file.filename || '';


    const product = await Product.findByIdAndUpdate(id, updateData);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    res.status(200).json(new ApiResponse(200, product, 'Product Updated Successfully'));
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
          new ApiResponse(500, null, 'Some error occurred while updating the product')
        );
    }
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new ApiError(404, 'Product not found');

    res.status(200).json(new ApiResponse(200, product, 'Product deleted successfully'));
  } catch (err) {
    console.log(err);
    if (err instanceof ApiError) {
      return res
        .status(err.statusCode)
        .json(new ApiResponse(err.statusCode, null, err.message));
    } else {
      return res
        .status(500)
        .json(new ApiResponse(500, null, 'Error occurred while deleting product'));
    }
  }
};


const getOrders = async (req, res) => {
  let page = req.query.page || 1;
  let limt = req.query.limt || 20;
  let skip = page * limt;
  let status = req.query.status
  let orders = await Order.find({ orderStatus: status }).limt(limt).skip(skip).sort({ timestamps: 1 })
  res.status(200).json(new ApiResponse(200, orders, 'Get Order  Successfully'));
}
const changeStatus = async (req, res) => {
  let status = req.body.status;
  let id = req.params.id;
  let order = await Order.findById(id);
  order.orderStatus = status;
  await order.save();
  res.status(200).json(new ApiResponse(200, 'Update Order Successfully'));
}

export { createProduct, allProducts, singleProduct, updateProduct, deleteProduct, getOrders, changeStatus, getCategoires };


