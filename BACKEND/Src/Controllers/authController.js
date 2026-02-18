const User=require('../Model/UserModel');
const jwt=require('jsonwebtoken');


const register=async(req,res)=>{
  try{
    console.log("Request body is : ",req.body);

     const{userName,email,password,phone,postalCode, address,role}=req.body;
     const newUser=new User({userName,email,password,role,phone, address,postalCode});
     await newUser.save();
     res.status(201).json({message:'User registered successfully',newUser});

  }catch(err){
      res.status(500).json({message:'User registration failed'+err});
  }
}


const login=async(req,res)=>{
    try{
        const{userName,password}=req.body;
        const userFind=await User.findOne({userName})

        if(!userFind){
            return res.status(404).json({message:`User ${userName} not found`});
        }

        if(userFind.password!==password){
            return res.status(401).json({message:'Password is not correct'});
        }

        const token=jwt.sign({id:userFind._id,role:userFind.role,userName:userFind.userName},process.env.JWT_SECRET_KEY,{expiresIn:'5h'});
        res.status(200).json({message:'User logged in successfully',token,userFind});
    }catch(err){
        res.status(500).json({message:'User login failed'});
    }
}

module.exports={
    register,
    login
}