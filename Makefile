# update lambda `kids` function with s3 file https://learning-activitiy-app.s3.us-east-1.amazonaws.com/function/function.zip
update-serverless:
	aws lambda update-function-code --function-name kids --s3-bucket learning-activitiy-app --s3-key function/function.zip
