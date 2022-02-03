import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";
import { v4 as uuid } from "uuid";

interface ICreateTodo {
  title: string;
  deadline: Date;
}

export const handle:  APIGatewayProxyHandler = async (event) => {

  const { userId } = event.pathParameters;

  const id = uuid();
  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;
  
  const response = await document.query({
    TableName: "todos",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": id,
    }
  }).promise();

  const todoAlreadyExists = response.Items[0];

  if(!todoAlreadyExists) {
    await document.put({
      TableName: "todos",
      Item: {
        id,
        userId,
        title,
        done: false, 
        deadline: new Date(deadline).getTime()
      }
    }).promise();

    const todo = await document.query({
      TableName: "todos",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      }
    }).promise();

    return {
      statusCode: 201,
      body: JSON.stringify(todo.Items[0])
    }

  }

  return {
    statusCode: 400,
    body: JSON.stringify(
      {
        message: "Something went wrong",  
      }
    )
  }
}
