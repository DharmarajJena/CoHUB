
const {User,Project}=require('./models');

const userRegistration=async(req,res)=>{

    try {
        
        data=req.body;
        const newUser=new User(data);
        newUser.email=req.firebaseUser.email;
        newUser.userId=req.firebaseUser.user_id;

        const response=await newUser.save();

        return res.status(200).json({message:"Registration successfull"});

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const startProject=async(req,res)=>{

    try {
        
        data=req.body;
        const newProject= new Project(data);
        newProject.userID=req.firebaseUser.user_id;
        const response=await newProject.save();
        return res.status(200).json({data:response});

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getAllProjects=async(req,res)=>{
    try {
        const projects=await Project.find({userID:req.firebaseUser.user_id});

        if(!projects)
            return res.status(404).json({message:"No projects found!"});

        return res.status(201).json(projects);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports={userRegistration,startProject,getAllProjects};