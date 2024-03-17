const express = require("express");
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const cors = require("cors");
const axios = require('axios');

const app = express();
connectDb();
app.use(cors());

const port = 5000;
app.use(express.json());
app.use(errorHandler);
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/restaurant" , require("./routes/restaurantRoutes"))

app.post("/api/send-otp", async (req, res) => {
  try {
    const mobileNumber = req.body.mobileNumber;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const response = await axios.post("https://www.fast2sms.com/dev/bulkV2", null, {
      params: {
        authorization: "oEfT7Tksa6EF5fK46o56cjjsI8H6NHhiJOcTpMICFgkuMgWtj1C8aMIUYSxU",
        variables_values: `Your OTP is ${otp}`,
        route: "otp",
        numbers: mobileNumber,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    if (response.data.return === true) {
      res.json({ status: true, message: "OTP sent successfully!" });
    } else {
      throw new Error(response.data.message || "Failed to send OTP.");
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ status: false, message: "Failed to send OTP." });
  }
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
