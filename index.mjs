import serverlessExpress from '@codegenie/serverless-express';
import app from './app.mjs';

console.log('Server is running in serverless production');
export const handler = serverlessExpress({ app })