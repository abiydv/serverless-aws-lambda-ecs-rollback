# Serverless: AWS Lambda to rollback AWS ECS deployment

Serverless framework example to deploy AWS Lambda, which can rollback a ECS deployment to the second last 'active' task definition version. Lambda runtime used - nodejs 8.x

![servrless](https://github.com/abiydv/ref-docs/blob/master/images/logos/serverless.png)
![js](https://github.com/abiydv/ref-docs/blob/master/images/logos/javascript.png)
![aws-lambda](https://github.com/abiydv/ref-docs/blob/master/images/logos/aws-lambda.png)
![aws-ecs](https://github.com/abiydv/ref-docs/blob/master/images/logos/aws-ecs-fargate.png)  

## Prerequisites
   **1.** Install serverless. Follow this [guide](https://serverless.com/framework/docs/providers/aws/guide/installation/)
   
   **2.** Setup aws cli with profiles matching environments/stages. A sample `~/.aws/credentials` file - 
   
   ```
   [dev]
   aws_access_key_id = DEV_ACCESS_KEY
   aws_secret_access_key = DEV_SECRET_KEY
   [qa]
   aws_access_key_id = QA_ACCESS_KEY
   aws_secret_access_key = QA_SECRET_KEY
   [prod]
   aws_access_key_id = PROD_ACCESS_KEY
   aws_secret_access_key = PROD_SECRET_KEY
   ```

## How to use

  **1.** Deploy the service with `--stage dev` argument to create the **dev** stack. Use **qa** or **prod** to launch function in other environments. <br><br>
  ***NOTE**: Create `config-qa.json` and `config-prod.json` with the respective AWS Account Id info.*

  ```
  serverless deploy -v --stage dev
  ```

  **2.** Invoke the lambda function
  ```
  serverless invoke -f rollback -l --stage dev
  ```

  **3.** Deploy only the lambda function after any change in lambda code. (Skip if no change)
  ```
  serverless deploy -f rollback --stage dev
  ```

  **4.** Cleanup everything
  ```
  serverless remove -v --stage dev
  ```

## Contact

Drop me a note or open an issue if something doesn't work out.

Cheers! :thumbsup:
