const { urlencoded } = require('express');
const express=require('express');
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');

const Campground = require('./models/campground');

const app=express();

app.set('view engine','ejs');
app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.render('home.ejs');
})

//To display CampList
app.get('/campground',async (req,res)=>{
    const campList=await Campground.find({});
    res.render('campIndex.ejs',{campList})
})

//To Display Individual Camp Details
app.get('/campdisplay/:id',async (req,res)=>{
    const campList=await Campground.find({_id : req.params.id});
    res.render('campDisplay.ejs',{campList})
})


//To Create new Camp
app.get('/campground/new',(req,res)=>{
    res.render('createCamp.ejs')
})

app.post('/campground',async(req,res)=>{
    const campground=new Campground(req.body);
    await campground.save();
    let campList=[];
    campList.push(campground);
    res.render('campDisplay.ejs',{campList})
})

//To Delete
app.delete('/campground/:id',async(req,res)=>{
    const{id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.render('home.ejs');

})

//To Update
app.get('/campground/:id/edit',async (req,res)=>{
    const campList=await Campground.find({_id : req.params.id});
    res.render('updateCamp.ejs',{campList})
})

app.put('/campground/edit/:id',async(req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndUpdate(id,req.body);
    const campList=await Campground.find({_id : req.params.id});
    res.render('campDisplay.ejs',{campList})
})


//Listening on port 3000
app.listen(3000,()=>{
    console.log("listening on 3000");
})