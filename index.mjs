'use strict'
import awsServerlessExpress from 'aws-serverless-express'
import app from './app.js'
const binaryMimeTypes = [
	'application/octet-stream',
	'font/eot',
	'font/opentype',
	'font/otf',
	'image/jpeg',
	'image/png',
	'image/svg+xml'
]
const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);
export const handler = (event, context) => awsServerlessExpress.proxy(server, event, context)
