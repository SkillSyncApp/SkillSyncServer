import express from "express";
import authMiddleware from "../middlewares/auth_middleware";
import chatController from "../controllers/chat.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: The Chat API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the message
 *         sender:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: The unique identifier of the sender
 *             name:
 *               type: string
 *               description: The name of the sender
 *             image:
 *               type: string
 *               description: The image URL of the sender
 *         content:
 *           type: string
 *           description: The content of the message
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the message was created
 *     Conversation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the conversation
 *         messages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Message'
 *     MessageRequest:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           description: The content of the message
 */

/**
 * @swagger
 * /chat/conversation:
 *   get:
 *     summary: Get user's conversations
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's conversations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Conversation'
 *       500:
 *         description: Internal server error
 */
router.get("/conversation", authMiddleware, chatController.getConversations);

/**
 * @swagger
 * /chat/conversation/with/{userId}:
 *   get:
 *     summary: Get conversation with a specific user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to get conversation with
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversation with the specified user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversation'
 *       500:
 *         description: Internal server error
 */
router.get(
  "/conversation/with/:userId",
  authMiddleware,
  chatController.getConversationWith
);

/**
 * @swagger
 * /chat/conversation/with/{userId}:
 *   post:
 *     summary: Start a conversation with a user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to start a conversation with
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversation'
 *       400:
 *         description: Conversation already exists
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/conversation/with/:userId",
  authMiddleware,
  chatController.addConversation
);

/**
 * @swagger
 * /chat/conversation/{id}/messages:
 *   get:
 *     summary: Get messages of a conversation
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the conversation
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Messages of the conversation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       500:
 *         description: Internal server error
 */
router.get(
  "/conversation/:id/messages",
  authMiddleware,
  chatController.getMessages
);

/**
 * @swagger
 * /chat/conversation/{id}/messages:
 *   post:
 *     summary: Send a message to a conversation
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the conversation
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MessageRequest'
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       404:
 *         description: Conversation not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/conversation/:id/messages",
  authMiddleware,
  chatController.sendMessage
);

export default router;
