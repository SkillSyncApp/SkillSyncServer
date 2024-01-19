import express from "express";
import postController from "../controllers/post.controller";
import authMiddleware from "../middlewares/auth_middleware";

const router = express.Router();

router.get("/:ownerId", authMiddleware, postController.getAllPostsByUserId.bind(postController));
router.get("/", authMiddleware, postController.get.bind(postController));
router.post("/", authMiddleware, postController.post.bind(postController));
router.put("/:id", authMiddleware, postController.putById.bind(postController));
router.delete("/:id", authMiddleware, postController.deleteById.bind(postController));

export default router;