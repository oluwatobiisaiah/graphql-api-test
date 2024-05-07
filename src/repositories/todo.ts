import Todos from "../entities/Todo.js";

export async function getAllTodos({limit}) {
    return await Todos.find().sort({ dateCreated: -1 }).limit(limit??10);
}

export async function getTodoById({id}) {
    return await Todos.findById(id);
}

export async function createTodo({title,description}) {
const result = await Todos.create({title,description});
return result;
}

export async function updateTodo({id,title,description,isCompleted}) {
    return await Todos.findByIdAndUpdate(id, {title,description,isCompleted}, {new: true});
}

export async function deleteTodo({id}) {
    return await Todos.findByIdAndDelete(id);
}