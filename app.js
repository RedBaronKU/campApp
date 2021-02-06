const { urlencoded } = require('express');
const express=require('express');
const {campgroundSchema}=require('./schema');
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const morgan=require('morgan');
const Campground = require('./models/campground');
const Review = require('./models/review');
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

//validate(Serverside)
const validateCampground=(req,res,next)=>
{
    
    const {error}=campgroundSchema.validate(req.body);
    if(error)
    {
        const msg=error.details.map(el=>el.message).join(',')
        throw new expressError(400,msg);
    }
    else{
        next();
    }
}

// Section 1. CRUD
//To display CampList
app.get('/campground',catchAsync(async(req,res)=>{
    const campList=await Campground.find({});
    res.render('campIndex.ejs',{campList})
}))

//To Display Individual Camp Details
app.get('/campdisplay/:id',catchAsync(async(req,res)=>{
    const camp=await Campground.findById(req.params.id).populate('reviews');
    res.render('campDisplay.ejs',{camp})
}))

//To Create new Camp
app.get('/campground/new',(req,res)=>{
    res.render('createCamp.ejs')
})

app.post('/campground',validateCampground,catchAsync(async(req,res,next)=>{
        //if(!req.body){throw new expressError(400,'Invalid Data')};
        const camp=new Campground(req.body.campground);
        await camp.save();
        res.render('campDisplay.ejs',{camp})
}))

//To Delete
app.delete('/campground/:id',catchAsync(async(req,res)=>{
    const{id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.render('home.ejs');

}))

//To Update
app.get('/campground/:id/edit',catchAsync(async(req,res)=>{
    const camp=await Campground.findById(req.params.id);
    res.render('updateCamp.ejs',{camp})
}))

app.put('/campground/edit/:id',validateCampground,catchAsync(async(req,res)=>{
    
    const {id}=req.params;

    await Campground.findByIdAndUpdate(id,req.body.campground);
    res.redirect(`/campdisplay/${req.params.id}`)
}))

// Section 2. Review

app.post('/campground/addreview/:id',catchAsync(async(req,res)=>{
    const campground= await Campground.findById(req.params.id);
    const review=new Review(req.body.review);
    console.log(campground);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campdisplay/${req.params.id}`)
}))




//Section: Error handle
app.all('*',(req,res,next)=>
{
    res.render('error_404');
    //next(new expressError(404,"Page Not Found"));
})
app.use((err,req,res,next)=>{
    res.render('errorOther',{err});
   
})

//Listening on port 3000
app.listen(3000,()=>{
    console.log("listening on 3000");
})