const mongoose = require("mongoose");

const restaurantSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add the name"],
    },
    description: {
      type: String,
      required: [true, "Please add the descrption"],
    },
    address: {
      type: String,
      required: [true, "Please add the address"],
    },
    city: {
      type: String,
      required: [true, "Please add the city"],
    },
    state: {
      type: String,
      required: [true, "Please add the state"],
    },
    image: {
      type: String,
      required: [true, "Please add the image"],
    },
    delivery_timing: {
      type: String,
      required: [true, "Please add the delivery timing"],
    },
    popular_dishes: {
      type: String,
      required: [true, "Please add the dishes"],
    },
    discounts: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Restaurants", restaurantSchema);
