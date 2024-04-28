import bcrypt from 'bcrypt';
import { User } from '../models/user.model.js';
import { transporter } from '../senders/emailSend.js';
import { generateOTP } from '../utils/otp.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

const createUser = async (req, res) => {
  try {
    const { email, password, userName } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ApiError(400, 'User with this email already exists.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ email, password: hashedPassword, userName });
    const userCreated = await newUser.save();

    return res
      .status(201)
      .json(new ApiResponse(201, userCreated, 'User registered Successfully'));
  } catch (err) {
    console.error(err);
    throw new ApiError(500, 'Internal Server Error');
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userLogin = await User.findOne({ email });

    if (!userLogin) {
      throw new ApiError(404, 'User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, userLogin.password);

    if (isPasswordValid) {
      res.status(200).json(new ApiResponse(200, userLogin, 'User login Successfully'));
    } else {
      throw new ApiError(401, 'Invalid password');
    }
  } catch (err) {
    console.error(err);
    throw new ApiError(500, 'Internal Server Error');
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    let userEmail = await User.findOne({ email });

    if (!userEmail) {
      throw new ApiError(404, 'This email does not exist');
    }

    const OTP = generateOTP(6);

    const mailOptions = {
      from: 'jeanne.considine54@ethereal.email',
      to: email,
      subject: 'Password Reset',
      html: `
        <div style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
            <h2 style="color: #333;">Password Reset</h2>
            <p style="color: #555;">Use the following verification code to reset your password:</p>
            <div style="background-color: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 18px; color: #333; margin: 20px 0;">
                <strong>${OTP}</strong>
            </div>
            <p style="color: #555;">This code is valid for a limited time. Do not share it with others.</p>
        </div>
    `,
    };

    await transporter.sendMail(mailOptions);
    const currentTime = new Date();
    const seconds = Math.floor(currentTime.getTime() / 1000) + 1000;
    userEmail.OTP = OTP;
    userEmail.expireTime = seconds;
    userEmail.expireTime = await userEmail.save();

    res
      .status(200)
      .json(new ApiResponse(200, 'OTP sent to your email for password reset'));
  } catch (err) {
    console.log(err);
    throw new ApiError(500, 'Service error');
  }
};

export { createUser, loginUser, forgotPassword };
