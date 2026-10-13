import mongoose from "mongoose";
import "dotenv/config";

const dbUrl = process.env.DB_URI;

const connectDb = () => {
  mongoose
    .connect(dbUrl)
    .then(() => {
      console.log(
        "roshni creations database connected ",
        mongoose.connection.db.databaseName,
      );
    })
    .catch((error) => {
      console.log(error.message);
      console.log("error connecting to roshni creations database");
    });
};

export default connectDb;
