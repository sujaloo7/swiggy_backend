const express = require("express");
const multer = require('multer');

const path = require('path');
// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads'); // Destination folder for storing uploaded images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with original extension
    }
});
const upload = multer({ storage: storage });

const { addRestaurant, all, deleteRestaurant, getrestaurant } = require("../controllers/restaurantController");
const router = express.Router();

router.post("/add", upload.single('image'), addRestaurant);
router.get("/all" , all);
router.delete("/delete/:id" , deleteRestaurant);
router.delete("/restaurant/:id" , getrestaurant);


module.exports = router;
