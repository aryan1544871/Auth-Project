const Joi = require('joi');
exports.signupSchema = Joi.object({
  email: Joi.string().email({tlds:{allow : ['com', 'net', 'org']}}).min(6).max(60).required(),
  password: Joi.string().required()
});

exports.signinSchema = Joi.object({
  email: Joi.string().email({tlds:{allow : ['com', 'net', 'org']}}).min(6).max(60).required(),
  password: Joi.string().required()
});