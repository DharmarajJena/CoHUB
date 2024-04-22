const express=require("express");
const router=express.Router();
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/images')
    },
    filename: function (req, file, cb) {
      cb(null,`${Date.now()}-${file.originalname}`);
    }
  })
  
const upload = multer({ storage: storage })


const middleware=require('../middleware');
const {userRegistration,startProject,getOwnProjects,addProduct,getOwnAvailableProduct,getAllProduct,getProductDetails
  ,getProjectDetails,getBuyOrderSummary,paymentSuccess,paymentCompleteWebHook,getRentedProducts,updateReturnStatus}=require('./views');

router.post('/userRegistration',middleware.verifyFirebaseToken,userRegistration);

router.post('/startProject',middleware.verifyFirebaseToken,startProject);
router.get('/getOwnProjects',middleware.verifyFirebaseToken,getOwnProjects);
router.get('/getProjectDetails/:projectID',middleware.verifyFirebaseToken,getProjectDetails);

router.post('/addProduct',middleware.verifyFirebaseToken,upload.single("image"),addProduct);
router.get('/getOwnAvailableProduct',middleware.verifyFirebaseToken,getOwnAvailableProduct);

router.get('/getAllProduct',middleware.verifyFirebaseToken,getAllProduct);//search

router.get('/getProductDetails/:productID',middleware.verifyFirebaseToken,getProductDetails);

router.post('/getBuyOrderSummary/:productID',middleware.verifyFirebaseToken,getBuyOrderSummary);

router.post('/paymentSuccess/:productID',middleware.verifyFirebaseToken,paymentSuccess);
router.post('/paymentCompleteWebHook',paymentCompleteWebHook);

router.get('/getRentedProducts',middleware.verifyFirebaseToken,getRentedProducts);

router.get('/updateReturnStatus/:orderID',middleware.verifyFirebaseToken,updateReturnStatus);

module.exports= router;