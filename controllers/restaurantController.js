const asynsHandler = require("express-async-handler");
const Restaurant = require("../models/restaurantModel");
const multer = require('multer');
const path = require('path');
// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Destination folder for storing uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with original extension
  }
});
const addRestaurant = asynsHandler(async (req, res) => {
  const {
    name,
    description,
    address,
    city,
    state,
    delivery_timing,
    popular_dishes,
    discounts,
  } = req.body;

  // Check if all mandatory fields are provided
  if (!name || !description || !address || !city || !state || !delivery_timing || !popular_dishes || !discounts) {
    return res.status(400).json({
      message: "All fields are mandatory!",
      status: false,
    });
  }

  try {
    let imageUrl = ''; // Variable to store the image URL
    if (req.file) {
      imageUrl = req.file.path; // Get the path of the uploaded image
    }

    // Create a new restaurant
    const restaurant = await Restaurant.create({
      name,
      description,
      address,
      city,
      state,
      delivery_timing,
      popular_dishes,
      discounts,
      image: imageUrl, // Assign the image URL to the 'image' field
    });

    console.log(`restaurant created ${restaurant}`);

    // Send response
    res.status(201).json({
      data: {
        _id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description,
        address: restaurant.address,
        city: restaurant.city,
        state: restaurant.state,
        delivery_timing: restaurant.delivery_timing,
        popular_dishes: restaurant.popular_dishes,
        discounts: restaurant.discounts,
        image: restaurant.image, // Send the image URL in the response
      },
      message: "Restaurant added successfully!",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Oops something went wrong!",
      status: false,
    });
  }
});

const all = asynsHandler(async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    console.log(restaurants)
    
    // Map through each restaurant document to extract necessary details
    const formattedRestaurants = restaurants.map(restaurant => ({
      _id: restaurant.id,
      name: restaurant.name,
      description: restaurant.description,
      address: restaurant.address,
      city: restaurant.city,
      state: restaurant.state,
      delivery_timing: restaurant.delivery_timing,
      popular_dishes: restaurant.popular_dishes,
      discounts: restaurant.discounts,
      image: `http://localhost:5000/${restaurant.image}`, // Include image URL
    }));

    res.status(200).json({
      data: {
        restaurants: formattedRestaurants, // Send the formatted restaurant data
      },
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
});

const getrestaurant = asynsHandler(async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      res.status(404);
      throw new Error("Restaurant not found");
    }
    res.status(200).json({
      data: {
        restaurant,
      },
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "not found" });
  }
});

const deleteRestaurant = asynsHandler(async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    console.log("restaurant", restaurant);

    if (!restaurant || restaurant == null || restaurant == "null") {
      res.status(404).json({ message: "Restaurant Not Found!", status: false });
    }

    await Restaurant.deleteOne();
    res.status(200).json({
      data: {
        id: restaurant.id,
      },
      message: `${restaurant.name} Was Deleted!`,
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", status: false }); // Add appropriate error handling for the client
  }
});
module.exports = { addRestaurant, all, deleteRestaurant , getrestaurant};
