
const {User,Project,Product}=require('./models');


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
const addProduct=async(req,res)=>{

    try {
        data=req.body;
        console.log(req.body)
        const newProduct=new Product(data);
        newProduct.image=req.file.path;
        newProduct.userID=req.firebaseUser.user_id;
        const response=await newProduct.save();

        return res.status(200).json({data:response});

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getOwnProduct=async(req,res)=>{
    try {
        const product=await Product.find({userID:req.firebaseUser.user_id});

        if(!product)
            return res.status(404).json({message:"No product found!"});

        return res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getAllProduct=async(req,res)=>{
    try {
        const product=await Product.find();

        if(!product)
            return res.status(404).json({message:"No product found!"});

        return res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports={userRegistration,startProject,getAllProjects,addProduct,getOwnProduct,getAllProduct};