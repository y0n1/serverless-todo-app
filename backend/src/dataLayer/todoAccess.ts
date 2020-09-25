import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly todoTable = process.env.TODOS_TABLE,
    private readonly bucketName = process.env.TODOS_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION) {
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todoTable,
      Item: todo
    }).promise()

    return todo
  }

  async getTodos(userId: string): Promise<TodoItem[]> {
    const result = await this.docClient.query({
      TableName: this.todoTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()
  
    return result.Items as TodoItem[]
  }

  async getTodo(todoId: string, userId: string): Promise<TodoItem> {
    const result = await this.docClient.get({
      TableName: this.todoTable,
        Key: {
          "userId": userId,
          "todoId": todoId
        }
    }).promise()
  
    return result.Item as TodoItem
  }

  async deleteTodo(todoId: string, userId: string): Promise<void> {
    await this.docClient.delete({
      TableName: this.todoTable,
        Key: {
          "userId": userId,
          "todoId": todoId
        }
    }).promise()
  }

  async updateTodo(todoId: string, userId: string, updatedTodo: TodoUpdate): Promise<void> {
    await this.docClient.update({
      TableName: this.todoTable,
        Key: {
          "userId": userId,
          "todoId": todoId
        },
        UpdateExpression: "set #todoName= :name, dueDate= :dueDate, done= :done",
        ExpressionAttributeValues:{
          ":name": updatedTodo.name,
          ":dueDate": updatedTodo.dueDate,
          ":done": updatedTodo.done
        },
        ExpressionAttributeNames:{
          "#todoName": "name"
        }
    }).promise()
  }

  async generateUploadUrl(todoId: string, userId: string): Promise<string> {
    const uploadUrl = `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
  
    await this.docClient.update({
      TableName: this.todoTable,
        Key: {
          "userId": userId,
          "todoId": todoId
        },
        UpdateExpression: "set attachmentUrl= :attachmentUrl",
        ExpressionAttributeValues:{
          ":attachmentUrl": uploadUrl
        }
    }).promise()

    return this.getUploadUrl(todoId)
  }

  private getUploadUrl(todoId: string) {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: this.urlExpiration
    })
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}