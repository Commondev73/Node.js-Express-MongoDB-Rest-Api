const Joi = require("@hapi/joi");

const deleteImageSchema = Joi.object({
  imageName: Joi.string().required()
});

const schema = Joi.object({
  topic: Joi.string().min(3).max(255).required(),
  detail: Joi.string().min(3).required(),
  deleteImage: Joi.array().items(deleteImageSchema), // use in router.patch
});

module.exports = schema;
