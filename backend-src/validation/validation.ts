
import Joi from "joi";
import { User } from "../models/user-model.js";

export const userSchema = Joi.object({
    name: Joi.string().min(1).max(255).required(), 
    isAdmin: Joi.boolean().strict().required(),    
});

export const validateUser = (user: any) => {
    return userSchema.validate(user); 
};

export const validateSearchQuery = (query: any) => {
    return Joi.string().min(1).max(255).required().validate(query); 
};
