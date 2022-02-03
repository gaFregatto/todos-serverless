import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handle:  APIGatewayProxyHandler = async (event) => {

  const { userId } = event.pathParameters;

  const response = await document.query({
    TableName: "todos",
    IndexName: "UserIdIndex",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    }
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}
