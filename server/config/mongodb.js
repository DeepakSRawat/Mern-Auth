import mongoose from "mongoose";

const mongodb = async () =>{

    mongoose.connection.on('connected', ()=> console.log("Databse connected"))

    await mongoose.connect(`${process.env.MONGODB_URL}/mernauth`);
}

export default mongodb;