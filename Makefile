# update lambda `kids` function with s3 file https://learning-activitiy-app.s3.us-east-1.amazonaws.com/function/function.zip
update-serverless:
	aws lambda update-function-code --function-name kids --s3-bucket learning-activitiy-app --s3-key function/function.zip

# create S3 trigger to automatically update lambda when function.zip is uploaded
setup-s3-trigger:
	@echo "Creating S3 trigger for automatic Lambda updates..."
	@echo "Step 1: Creating IAM role for EventBridge to update Lambda"
	aws iam create-role --role-name LambdaAutoUpdateRole --assume-role-policy-document "{\"Version\": \"2012-10-17\", \"Statement\": [{\"Effect\": \"Allow\", \"Principal\": {\"Service\": \"events.amazonaws.com\"}, \"Action\": \"sts:AssumeRole\"}]}" || echo "Role may already exist"
	
	@echo "Step 2: Attaching policy to allow Lambda updates"
	aws iam attach-role-policy --role-name LambdaAutoUpdateRole --policy-arn arn:aws:iam::aws:policy/AWSLambdaFullAccess || echo "Policy may already be attached"
	
	@echo "Step 3: Creating EventBridge rule for S3 object creation"
	aws events put-rule --name "LambdaAutoUpdateRule" --event-pattern "{\"source\": [\"aws.s3\"], \"detail-type\": [\"Object Created\"], \"detail\": {\"bucket\": {\"name\": [\"learning-activitiy-app\"]}, \"object\": {\"key\": [\"function/function.zip\"]}}}" || echo "Rule may already exist"
	
	@echo "Step 4: Creating Lambda function to handle the update"
	aws lambda create-function \
		--function-name lambda-auto-updater \
		--runtime python3.9 \
		--role arn:aws:iam::149536459346:role/LambdaAutoUpdateRole \
		--handler index.handler \
		--zip-file fileb://lambda-updater.zip \
		--timeout 60 \
		--memory-size 128 || echo "Function may already exist"
	
	@echo "Step 5: Adding EventBridge permission to invoke the updater function"
	aws lambda add-permission \
		--function-name lambda-auto-updater \
		--statement-id "AllowEventBridge" \
		--action "lambda:InvokeFunction" \
		--principal events.amazonaws.com \
		--source-arn arn:aws:events:us-east-1:149536459346:rule/LambdaAutoUpdateRule || echo "Permission may already exist"
	
	@echo "Step 6: Adding EventBridge target to invoke the updater function"
	aws events put-targets --rule "LambdaAutoUpdateRule" --targets "{\"Id\": \"1\", \"Arn\": \"arn:aws:lambda:us-east-1:149536459346:function:lambda-auto-updater\"}" || echo "Target may already exist"
	
	@echo "S3 trigger setup complete! Lambda will now auto-update when function.zip is uploaded."

# create the lambda updater function code
create-updater-lambda:
	@echo "Creating Lambda updater function code..."
	@mkdir -p temp-lambda
	@echo 'import json' > temp-lambda/index.py
	@echo 'import boto3' >> temp-lambda/index.py
	@echo '' >> temp-lambda/index.py
	@echo 'def handler(event, context):' >> temp-lambda/index.py
	@echo '    """Lambda function to automatically update the kids function when S3 object is uploaded"""' >> temp-lambda/index.py
	@echo '    try:' >> temp-lambda/index.py
	@echo '        lambda_client = boto3.client("lambda")' >> temp-lambda/index.py
	@echo '        ' >> temp-lambda/index.py
	@echo '        # Update the kids function with the new code from S3' >> temp-lambda/index.py
	@echo '        response = lambda_client.update_function_code(' >> temp-lambda/index.py
	@echo '            FunctionName="kids",' >> temp-lambda/index.py
	@echo '            S3Bucket="learning-activitiy-app",' >> temp-lambda/index.py
	@echo '            S3Key="function/function.zip"' >> temp-lambda/index.py
	@echo '        )' >> temp-lambda/index.py
	@echo '        ' >> temp-lambda/index.py
	@echo '        print(f"Successfully updated kids function: {response}")' >> temp-lambda/index.py
	@echo '        ' >> temp-lambda/index.py
	@echo '        return {' >> temp-lambda/index.py
	@echo '            "statusCode": 200,' >> temp-lambda/index.py
	@echo '            "body": json.dumps({' >> temp-lambda/index.py
	@echo '                "message": "Lambda function updated successfully",' >> temp-lambda/index.py
	@echo '                "functionName": "kids",' >> temp-lambda/index.py
	@echo '                "version": response.get("Version", "unknown")' >> temp-lambda/index.py
	@echo '            })' >> temp-lambda/index.py
	@echo '        }' >> temp-lambda/index.py
	@echo '        ' >> temp-lambda/index.py
	@echo '    except Exception as e:' >> temp-lambda/index.py
	@echo '        print(f"Error updating Lambda function: {str(e)}")' >> temp-lambda/index.py
	@echo '        return {' >> temp-lambda/index.py
	@echo '            "statusCode": 500,' >> temp-lambda/index.py
	@echo '            "body": json.dumps({' >> temp-lambda/index.py
	@echo '                "error": str(e)' >> temp-lambda/index.py
	@echo '            })' >> temp-lambda/index.py
	@echo '        }' >> temp-lambda/index.py
	
	@cd temp-lambda && zip -r ../lambda-updater.zip .
	@rm -rf temp-lambda
	@echo "Lambda updater code created: lambda-updater.zip"

# complete setup: create updater lambda and setup trigger
setup-auto-update: create-updater-lambda setup-s3-trigger
	@echo "Auto-update setup complete!"
	@echo "Now when you upload function.zip to S3, the kids Lambda function will automatically update."