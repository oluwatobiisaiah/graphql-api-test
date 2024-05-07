import { Schema,model } from "mongoose";

const todoSchema = new Schema({
    title: {
    type: String,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  description:{
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default model('Todo', todoSchema);