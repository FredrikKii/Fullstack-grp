import Joi from "joi";
import { Cart } from "../models/cart-model.js";
import { User } from "../models/user-model.js";
import { Hat } from "../models/hat-model.js";

export const userSchema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    isAdmin: Joi.boolean().truthy("true").falsy("false").required(),
});

export const hatSchema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    price: Joi.number().strict().positive().precision(4).required(),
    amountInStock: Joi.number().strict().integer().min(0).required(),
    image: Joi.string().optional(),
});

export const cartSchema = Joi.object({
    _id: Joi.any().optional(),
    userId: Joi.string().required(),
    productId: Joi.string().required(),
    amount: Joi.number().strict().integer().min(0).required(),
});

export const validateUser = (user: User) => {
    return userSchema.validate(user);
};

export const validateHat = (hat: Hat) => {
    return hatSchema.validate(hat);
};
export const validateCart = (cart: Cart) => {
    return cartSchema.validate(cart);
};

export const validateSearchQuery = (query: any) => {
    return Joi.string().min(1).max(255).required().validate(query);
};

//.truthy("true").falsy("false")
