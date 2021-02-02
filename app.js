const { urlencoded } = require('express');
const express=require('express');
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const morgan=require('morgan');
const Campground = require('./models/campground');
const expressError = require('./utils/catchError');
const catchAsync = require('./utils/catchAsync');

const app=express();

app.set('view engine','ejs');
app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}))
app.use(morgan('tiny'));

app.get('/',(req,res)=>{
    res.render('home.ejs');
})

//To display CampList
app.get('/campground',catchAsync(async(req,res)=>{
    const campList=await Campground.find({});
    res.render('campIndex.ejs',{campList})
}))

//To Display Individual Camp Details
app.get('/campdisplay/:id',catchAsync(async(req,res)=>{
    const campList=await Campground.find({_id : req.params.id});
    res.render('campDisplay.ejs',{campList})
}))


//To Create new Camp
app.get('/campground/new',(req,res)=>{
    res.render('createCamp.ejs')
})

app.post('/campground',catchAsync(async(req,res,next)=>{
        if(!req.body){throw new expressError(400,'Invalid Data')};
        const campground=new Campground(req.body);
        await campground.save();
        let campList=[];
        campList.push(campground);
        res.render('campDisplay.ejs',{campList})
}))


//To Delete
app.delete('/campground/:id',catchAsync(async(req,res)=>{
    const{id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.render('home.ejs');

}))

//To Update
app.get('/campground/:id/edit',catchAsync(async(req,res)=>{
    const campList=await Campground.find({_id : req.params.id});
    res.render('updateCamp.ejs',{campList})
}))

app.put('/campground/edit/:id',catchAsync(async(req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndUpdate(id,req.body);
    const campList=await Campground.find({_id : req.params.id});
    res.render('campDisplay.ejs',{campList})
}))

//Error handle
app.all('*',(req,res,next)=>
{
    res.render('error_404');
    //next(new expressError(404,"Page Not Found"));
})
app.use((err,req,res,next)=>{
    console.log(err);
    res.send("Something went wrong");
})



//Listening on port 3000
app.listen(3000,()=>{
    console.log("listening on 3000");
})