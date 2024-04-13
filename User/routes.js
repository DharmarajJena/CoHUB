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
const {userRegistration,startProject,getAllProjects,addProduct,getOwnProduct,getAllProduct}=require('./views');

router.post('/userRegistration',middleware.verifyFirebaseToken,userRegistration);
router.post('/startProject',middleware.verifyFirebaseToken,startProject);
router.get('/getAllProjects',middleware.verifyFirebaseToken,getAllProjects);

router.post('/addProduct',middleware.verifyFirebaseToken,upload.single("image"),addProduct);
router.get('/getOwnProduct',middleware.verifyFirebaseToken,getOwnProduct);

router.get('/getAllProduct',middleware.verifyFirebaseToken,getAllProduct);//search

module.exports= router;