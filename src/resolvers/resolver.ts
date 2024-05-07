import { Resolvers } from "../__graphql-gen/resolverTypes";
import { createTodo, deleteTodo, getAllTodos,getTodoById, updateTodo } from "../repositories/todo.js";
const resolvers: Resolvers = {
    Query: {
    todos: async (_, { limit }) => {
        return await getAllTodos({limit});
    },
    todo: async (_,{ID})=>{
        return await getTodoById({id:ID})
    }

},
Mutation:{
 addTodo: async (_,{title,description})=>{
    const result = await createTodo({title,description});
    return result;
},
updateTodo: async (_,{id,title,description,isCompleted})=>{
    return await updateTodo({id,title,description,isCompleted});
},
deleteTodo: async (_,{id})=>{
    return await deleteTodo({id});
}
}
}
export default resolvers;