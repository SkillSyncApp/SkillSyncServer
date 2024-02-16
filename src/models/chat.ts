import { Schema, Document, model, Types } from 'mongoose';

export interface IChat extends Document {
  users: Types.ObjectId[];
  messages: Types.ObjectId[];
  lastMessage: Types.ObjectId | null;
}

const chatSchema = new Schema<IChat>(
  {
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message'}]    
  }
);

const ChatModel = model<IChat>("Chat", chatSchema);

export default ChatModel;