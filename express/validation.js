const Joi = require('@hapi/joi');

const registerValidation = (body) => {
    const schema = Joi.object(
        { name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required() 
    });

    return schema.validate(body);
}

const loginValidation = (body) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required() 
    });

    return schema.validate(body);
}

const updateClubValidation = (body) => {
    const schema = Joi.object({
        id: Joi.string().min(6).required(),
        name: Joi.string().min(6).required(),
        leagueIds: Joi.array().required()
    });

    return schema.validate(body);
}

const removeClubValidation = (body) => {
    const schema = Joi.object({
        id: Joi.string().min(6).required()
    });

    return schema.validate(body);
}


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.updateClubValidation = updateClubValidation;
module.exports.removeClubValidation = removeClubValidation;
