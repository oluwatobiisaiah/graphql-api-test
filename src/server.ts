import app from "./app.js";
import mongoose from "mongoose";
import config from "./config/config.js";
(async () => {
    try {
       const connection = await mongoose.connect(config.DATABASE_URI);
       app.listen(config.APP_PORT, () => {
          console.log(`🚀 Server ready at ${config.APP_PORT}`);
       });
    } catch (error) {
       console.log("Unable to start server", error);
    }
 })()