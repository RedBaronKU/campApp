const mongoose = require('mongoose');
const cities = require('./cityList');
const { places, descriptors } = require('./seedHelper');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/campApp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    let price=Math.floor(Math.random()*100);
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/random',
            Price: price,
            description:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non nostrum odio veritatis, est ducimus culpa sint. Libero tempora, illum quaerat autem eius cupiditate sit est, sapiente tempore, necessitatibus fugiat velit!'
        })
        await camp.save();
    }
}
console.log("Database modified success... closing database");

seedDB().then(() => {
    mongoose.connection.close();
})