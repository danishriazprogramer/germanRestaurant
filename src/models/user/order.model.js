import { Schema, model } from 'mongoose';
import JWT from 'jsonwebtoken'; // Assuming you have JWT imported

const orderSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, 'Email address is required'],
    },
    orderStatus: {
      type: String,
      enum: ["NEW", "ACCEPTED", "REJECTED", "IN_PROCESS", "COMPLETED"],
      default: "NEW",
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: ['Cash on Delivery', 'PayPal', 'Stripe'],
    },
    phone: {
      type: Number,
      required: [true, 'Phone No. is required'],
    },
    productDetails: [
      {
        productId: {
          type: String,
          //required: [true, 'Product ID is required'],
        },
        productName: {
          type: String,
          //required: [true, 'Product Name is required'],
        },
        quantity: {
          type: Number,
          //required: [true, 'Quantity is required'],
          integer: true,
        },
        size: String,
        Price: {
          type: String,
          //required: [true, 'Price is required'],
        },
      },
    ],
    totalQuantity: String,
    totalPrice: String,
  },
  {
    timestamps: true,
  }
);

const Order = model('Order', orderSchema);

export { Order };
