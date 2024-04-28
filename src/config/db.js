import mongoose from "mongoose";

const connectDataBase = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DB_URL}`);
        console.log(`Mongoose Connect Successfully ✅ \n DB Name: ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log('Fail to connect to DB! ❌', error);
    }
};

export { connectDataBase };