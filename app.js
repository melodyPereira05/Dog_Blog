const express=require("express"),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
methodOverride=require('method-override');
//expressSanitizer=require('express-sanitizer');


var app=express();
mongoose.connect("mongodb://localhost/restful_blog_app",{useNewUrlParser:true,useUnifiedTopology:true});
app.set("view engine","ejs");
//custom stylesheets
app.use(express.static("public"));
app.use(methodOverride("_method"));
//middleware
app.use(bodyParser.urlencoded({extended:true}));
//app.use(expressSanitizer());
//mongooose.modelu
var blogSchema= new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("blog",blogSchema);

// Blog.create({
//     title:"Cute puppies",
//     image:"https://images.unsplash.com/photo-1546238232-20216dec9f72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
//     body:"Hello this a blog post of dog"
// },(error,CreatedBlog)=>{
//     if(error)
//     {
//         console.log(error);
//     }
//     else{
//         console.log(CreatedBlog);
//     }

// });
app.get('/',(req,res)=>{
    res.redirect('/blogs');
});
app.get('/blogs',(req,res)=>{
    console.log(req.body);
    //req.body.blog.body=req.sanitize(req.body.blog.body);
    console.log(req.body)
    Blog.find({},(error,data)=>{
        if(error){
            console.log(error);
        }
        else{
            res.render("index",{blogs:data});
        }
    });
});
app.post('/blogs',(req,res)=>{
    Blog.create(req.body.blog ,(err,newBlog)=>{
        console.log(req.body.blog);
        if(err)
        {
            res.render("new");
        }
        else{
            res.redirect('/blogs');
        }

    });
});

//     app.get('/blogs/new',(req,res)=>{
//         console.log("New template render");
//         res.render("new");
//     });
// });
app.get('/blogs/new',(req,res)=>{
    console.log("Render new page");
    res.render("new");
        
});

app.get('/blogs/:id',(req,res)=>{
    Blog.findById(req.params.id,(err,data)=>{
        if(err)
        {
            res.redirect('/blogs');
        }
        else{
            res.render("show",{blog:data});
        }
    });

});
app.get('/blogs/:id/edit',(req,res)=>{
    //req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findById(req.params.id,(err,data)=>{
        if(err)
        {
            res.redirect('/blogs');
        }
        else
        {
            res.render("edit",{ blog:data });
        }

    });

});
//update route

app.put('/blogs/:id',(req,res)=>{
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,UpdatedBlog)=>{
        if(err)
        {
            res.redirect('/blogs');
        }
        else{
            res.redirect('/blogs/'+req.params.id);
        }
    });
});

//delete route
app.delete('/blogs/:id',(req,res)=>{
    console.log(req.param.id);
    Blog.findByIdAndDelete(req.params.id,(err)=>{
        if(err)
        {
            res.redirect('/blogs');
        }
        else{
            res.redirect('/blogs');
        }
    });

});




const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log("Server has started");
});
