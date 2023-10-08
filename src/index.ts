import WebsitePing from "./logic/cron";
import mongoose from "mongoose";
import 'dotenv/config';
import server from "./server";


const HOST = process.env.HOST || "localhost";
const PORT = +(process.env.PORT || 3000);


const uri = process.env.MONGO_URI || "";

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB successfully");
    
    let websitePing = new WebsitePing();
    websitePing.setupJobs();
  })
  .catch((err: any) => {
    console.error.bind("Error connecting to MongoDB: ", err);
  });
  


server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});

export default server;
