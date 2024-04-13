const express=require("express");
const router=express.Router();

const middleware=require('../middleware');
const {userRegistration,startProject,getAllProjects}=require('./views');

router.post('/userRegistration',middleware.verifyFirebaseToken,userRegistration);
router.post('/startProject',middleware.verifyFirebaseToken,startProject);
router.get('/getAllProjects',middleware.verifyFirebaseToken,getAllProjects);



module.exports= router;