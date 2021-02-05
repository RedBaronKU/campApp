const Joi=require('joi')
module.exports.campgroundSchema=Joi.object({
    campground:Joi.object({
        title:Joi.string().required(),
        Price:Joi.number().required().min(0),
        location:Joi.string(),
        image: Joi.string(),
        description: Joi.string()
    }).required()
})