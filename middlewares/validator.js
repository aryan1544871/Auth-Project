const Joi = require('joi');
exports.signupSchema = Joi.object({
  email: Joi.string().email({tlds:{allow : ['com', 'net', 'org']}}).min(6).max(60).required(),
  password: Joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
});