import * as uuid from 'uuid'

import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/toDoAccess'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

const todoAccess = new TodoAccess()
const logger = createLogger('TodoAccess')

export async function createTodo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
  logger.info('Creating the todo for the user', { userId: userId })

  const itemId = uuid.v4()

  return await todoAccess.createTodo({
    todoId: itemId,
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    createdAt: new Date().toISOString()
  })
}

export async function getTodos(userId: string): Promise<TodoItem[]> {
  logger.info('Getting todos for the user', { userId: userId })

  return await todoAccess.getTodos(userId)
}

export async function getTodo(todoId: string, userId: string): Promise<TodoItem> {
  logger.info('Getting the todo for the user', { todoId: todoId, userId: userId })

  return await todoAccess.getTodo(todoId, userId)
}

export async function deleteTodo(todoId: string, userId: string): Promise<void> {
  logger.info('Deleting the todo for the user', { todoId: todoId, userId: userId })
  
  await todoAccess.deleteTodo(todoId, userId)
}

export async function updateTodo(todoId: string, userId: string, updatedTodo: UpdateTodoRequest): Promise<void> {
  logger.info('Updating the todo for the user', { todoId: todoId, userId: userId })

  await todoAccess.updateTodo(todoId, userId, {
    name: updatedTodo.name,
    dueDate: updatedTodo.dueDate,
    done: updatedTodo.done
  })
}

export async function generateUploadUrl(todoId: string, userId: string): Promise<string> {
  logger.info('Generating the upload url for the todo of the user', { todoId: todoId, userId: userId })
  
  return await todoAccess.generateUploadUrl(todoId, userId)
}