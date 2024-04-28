import { Schema, model } from 'mongoose';

const orderSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
    }, 
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, 'Email address is required'],
    },
    orderStatus : {
      type: String,
      enum :["NEW","ACCEPETEC","REJECTED","INPROCESS","COMPLETED"],
      default :"NEW",        
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    location: String,
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: ['Cash on Delivery', 'PayPal', 'Stripe'],
    },
    contact: {
      type: Number,
      required: [true, 'Contact No. is required'],
    },
    productDetails: [
      {
        id: {
          type: String,
          required: [true, 'Id is required'],
        },
        name: {
          type: String,
          required: [true, 'Name is required'],
        },
        unitPrice: {
          type: Number,
          required: [true, 'Unit price is required'],
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity is required'],
          integer: true,
        },
        size: String,
        grandPrice: {
          type: Number,
          required: [true, 'Grand Price is required'],
        },
      },
    ],
    totalQuantity: Number,
    totalPrice: Number,
  },
  {
    timestamps: true,
  }
);

const Order = model('Order', orderSchema);

export { Order };
