const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const username = encodeURIComponent("swiggy");
    const password = encodeURIComponent("swiggy@123");
    const uri = `mongodb+srv://${username}:${password}@cluster0.ahtcuhz.mongodb.net/swiggy_db?retryWrites=true&w=majority`;
    
    const connect = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      "Database Connected:",
      connect.connection.host,
      connect.connection.name
    );
  } catch (error) {
    console.error("Error connecting to database:", error.message);
    process.exit(1);
  }
};

module.exports = connectDb;
