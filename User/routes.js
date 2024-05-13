const express = require("express");
const router = express.Router();
const multer = require('multer')
const middleware = require('../middleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/images')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
})
const upload = multer({ storage: storage })


const { userRegistration, startProject, getOwnProjects, addProduct, getOwnAvailableProduct, getAllProduct, getProductDetails
  , getProjectDetails, getBuyOrderSummary, paymentSuccess, paymentCompleteWebHook, getRentedProducts, updateReturnStatus,
  getOrderHistory, addIdealDescription, cohubChatBot, reccomendProducts, bookProduct, bookingPayment,getBookedProducts,getlanglat, getUserInfo} = require('./views');


//User Registration
router.post('/userRegistration', middleware.verifyFirebaseToken, userRegistration);
router.get('/getUserInfo', middleware.verifyFirebaseToken, getUserInfo);

//Project Functionalities
router.post('/startProject', middleware.verifyFirebaseToken, startProject);
router.get('/getOwnProjects', middleware.verifyFirebaseToken, getOwnProjects);
router.get('/getProjectDetails/:projectID', middleware.verifyFirebaseToken, getProjectDetails);
router.post('/addIdealDescription/:projectID', middleware.verifyFirebaseToken, addIdealDescription);

//Product Functionalities
router.post('/addProduct', middleware.verifyFirebaseToken, upload.single("image"), addProduct);
router.get('/getOwnAvailableProduct', middleware.verifyFirebaseToken, getOwnAvailableProduct);
router.get('/getAllProduct', middleware.verifyFirebaseToken, getAllProduct);//search, its for client who want to buy products
router.get('/getProductDetails/:productID', middleware.verifyFirebaseToken, getProductDetails);
router.get('/getRentedProducts', middleware.verifyFirebaseToken, getRentedProducts);
router.post('/bookProduct/:productID',middleware.verifyFirebaseToken,bookProduct);
router.get('/getBookedProducts',middleware.verifyFirebaseToken,getBookedProducts);

//Payment and razorpay
router.post('/getBuyOrderSummary/:productID', middleware.verifyFirebaseToken, getBuyOrderSummary);
router.get('/bookingPayment', middleware.verifyFirebaseToken, bookingPayment);
router.post('/paymentSuccess/:productID', middleware.verifyFirebaseToken, paymentSuccess);
router.post('/paymentCompleteWebHook', paymentCompleteWebHook);

//Order functionalities
router.get('/updateReturnStatus/:orderID', middleware.verifyFirebaseToken, updateReturnStatus);
router.get('/getOrderHistory', middleware.verifyFirebaseToken, getOrderHistory);
router.get('/getlanglat', middleware.verifyFirebaseToken, getlanglat);

//ChatBot and product reccomendation
router.get('/reccomendProducts/:projectID', reccomendProducts);
router.post('/cohubChatBot', cohubChatBot);

module.exports = router;