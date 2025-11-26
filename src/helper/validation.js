const Joi = require("joi");

const registerValidation = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "in"] },
    })
    .regex(/^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+)\.([a-zA-Z]{2,5})$/)
    .required(),
  password: Joi.string().min(6).required(),
  cpassword: Joi.string().min(6).required().valid(Joi.ref("password")),
});

const loginValidation = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "in"] },
    })
    .regex(/^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+)\.([a-zA-Z]{2,5})$/)
    .required(),
  password: Joi.string().required(),
});

module.exports = {
  registerValidation,
  loginValidation
};
