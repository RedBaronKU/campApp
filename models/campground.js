const mongoose= require('mongoose');
mongoose.connect('mongodb://localhost:27017/campApp', {useNewUrlParser: true,useCreateIndex:true,useUnifiedTopology:true})
.then(console.log("Successfully Connected to mongoose"))
.catch(err=>{console.log(err)});

var schema=mongoose.Schema;
var campSchema=new mongoose.Schema({
    title:String,
    location:String,
    image: String,
    Price: Number,
    description: String
})

module.exports=mongoose.model('Campground',campSchema);