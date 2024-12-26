// console.log("Hello")
const express = require("express");
const dbConnection = require("./src/config/dbConnection");
const dotenv = require("dotenv");
const userRoute = require("./src/routes/userRoute");
const contactRouter = require("./src/routes/contactRoute");
const bodyParser = require("body-parser");
const cors = require("cors");
const errorController = require("./src/controllers/errorController");

dotenv.config();
const app = express();
const port = process.env.PORT || 3501;

dbConnection();

app.use(express.json());
// app.use(bodyParser.json());
app.use(cors());

app.use("/",(req,res,next)=>{
    console.log(req.path,req.method);
    next();
})

app.use("/api/auth/", userRoute);
app.use("/api/contact/",contactRouter);

app.use(errorController);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
