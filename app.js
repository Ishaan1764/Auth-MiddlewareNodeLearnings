const express=require('express');
const app=express();
const path=require('path');
const jwt=require('jsonwebtoken');

const JWT_SECRET="JWT_SECRET";

const users=[];
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());

// app.get("/",(req,res)=>{
//     res.render("index");
// });
//* signup
app.post("/signup",function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    users.push({
        username:username,
        password:password
    });
    res.json({
        message:"You SIGNED UP!!"
    })
});
//* Signin
app.post("/signin",function(req,res){
    const username=req.body.username;
    const password=req.body.password;

    let foundUser=null;
    for(let i=0;i<users.length;i++){
        if(users[i].username===username&& users[i].password===password){
            foundUser=users[i];
        }
    }
    if(!foundUser){
        res.json({
            message:"CREDENTIAL INCORRECT!!"
        })
        return
    }else{
        const token = jwt.sign({
            username
        },JWT_SECRET);
        res.json({
            token:token
        });
    }
})



    //decode nhi krna chaheiye bcz agar koi aur aapke key extract kr lega to huse password vgera pta lgg jaega and then he can use ur credentials


    //^ const decodedData= jwt.decode(token);

    //istead we should do verify as ke jo humne send ke hai secret agar usse vo match hota hai to he content show krna vrna nhi.
//* Home


function authMiddleware(req,res,next){
    const token=req.headers.token;
    const decodedData = jwt.verify(token,JWT_SECRET);
    if(decodedData.username){
        //& yaha humne phle username ko agle routes pr nhi send keya tha pr ab hm req.username he change kr dete hai (modifying data jiska mtlb hai) ke agla jo bhi route req krega use username ke leye new wala he ilega jo middleware mei change keya hai.
        req.username=decodedData.username;
        next();
    }else{
        res.json({
            message:'you are not loggedIN'
        })
    }
}


app.get("/home", authMiddleware,function (req, res) {
        let foundUser = null;
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === req.username) {
                foundUser = users[i];
                break; // Stop the loop once the user is found
            }
        }

        if (!foundUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Ensure foundUser is not null before accessing its properties
        res.json({
            username: foundUser.username,
            password: foundUser.password
        });
});



app.listen(3001);