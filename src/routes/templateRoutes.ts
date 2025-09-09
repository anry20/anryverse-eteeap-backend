import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  getMessage,
  getMessages,
  updateMessage,
} from "../controllers/templateController";

const router = Router();

router.get("/messages", getMessages);
router.get("/messages/:id", getMessage);
router.post("/messages", createMessage);
router.delete("/messages/:id", deleteMessage);
router.put("/messages/:id", updateMessage);

export default router;
