const express=require("express");
const router=express.Router();

//Index-post
router.get("/",(req,res)=>{
    res.send("GET for post");
});

//Show-posts
router.get("/:id",(req,res)=>{
    res.send("GET for post id");
});

//POST-posts
router.post("/",(req,res)=>{
    res.send("POST for posts");
});

//Delete-posts
router.get("/:id",(req,res)=>{
    res.send("DELETE for posts");
});


module.exports=router;