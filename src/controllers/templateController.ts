import type { Request, Response, NextFunction } from "express";
import type { AppError } from "../middlewares/errorHandler";
import { messages } from "../models/templateModel";

export const createMessage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message } = req.body;
    if (typeof message !== "string" || message.trim() === "") {
      const err = new Error("Message is required and must be a string");
      (err as AppError).status = 400;
      throw err;
    }
    messages.push({ id: messages.length + 1, message });
    res.status(201).json({ message });
  } catch (error) {
    next(error); // Pass to global error handler
  }
};

export const updateMessage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    if (typeof message !== "string" || message.trim() === "") {
      const err = new Error("Message is required and must be a string");
      (err as AppError).status = 400;
      throw err;
    }
    const index = messages.findIndex((msg) => msg.id === parseInt(id));
    if (index === -1) {
      const err = new Error("Message not found");
      (err as AppError).status = 404;
      throw err;
    }
    messages[index].message = message;
    res.status(200).json({ message });
  } catch (error) {
    next(error); // Pass to global error handler
  }
};

export const deleteMessage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const index = messages.findIndex((msg) => msg.id === parseInt(id));
    if (index === -1) {
      const err = new Error("Message not found");
      (err as AppError).status = 404;
      throw err;
    }
    messages.splice(index, 1);
    res.status(204).send();
  } catch (error) {
    next(error); //pass to global error handler
  }
};

export const getMessages = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(200).json(messages);
};

export const getMessage = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const message = messages.find((msg) => msg.id === parseInt(id));
    if (!message) {
      const err = new Error("Message not found");
      (err as AppError).status = 404;
      throw err;
    }
    res.status(200).json(message);
  } catch (error) {
    next(error); //pass to global error handler
  }
};
