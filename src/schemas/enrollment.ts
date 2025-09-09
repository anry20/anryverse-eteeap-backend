import Joi from "joi";

export const studentSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  courseId: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  address: Joi.string().required(),
  sex: Joi.string().valid("Male", "Female").required(),
  dateEnrolled: Joi.date().required(),
  placeOfBirth: Joi.string().required(),
});
