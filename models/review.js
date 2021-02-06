const mongoose= require('mongoose');
mongoose.connect('mongodb://localhost:27017/campApp', {useNewUrlParser: true,useCreateIndex:true,useUnifiedTopology:true})
.catch(err=>{console.log(err)});

var schema=mongoose.Schema;
var reviewSchema=new mongoose.Schema({
    Rating: Number,
    reviewBody: String
})

module.exports=mongoose.model('Review',reviewSchema);