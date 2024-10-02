import Joi from "joi";
import { User } from "../models/user-model.js";

export const userSchema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    isAdmin: Joi.boolean().truthy("true").falsy("false").required(),
});

export const hatSchema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    price: Joi.number().positive().precision(4).required(),
    amountInStock: Joi.number().integer().min(0).required(),
    image: Joi.string().optional(),
});

export const cartSchema = Joi.object({
    _id: Joi.any().optional(),
    userId: Joi.string().required(),
    productId: Joi.string().required(),
    amount: Joi.number().integer().min(0).required(),
});

export const validateUser = (user: any) => {
    return userSchema.validate(user);
};

export const validateHat = (user: any) => {
    return hatSchema.validate(user);
};
export const validateCart = (user: any) => {
    return cartSchema.validate(user);
};

export const validateSearchQuery = (query: any) => {
    return Joi.string().min(1).max(255).required().validate(query);
};

//.truthy("true").falsy("false")
