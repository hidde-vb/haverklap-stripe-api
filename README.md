# Stripe Checkout API

A function which acts as porxy for a low footprint stripe checkout flow, build for AWS Lambda.
Build with the Serverless Framework.

## Usage

### Deployment

Install dependencies with:

```
npm install
```

and you want to run it locally:

```
sls offline
```

you can deploy with:

```
sls deploy function -f api --aws-profile personal
```

```bash
Deploying aws-node-express-api-project to stage dev (us-east-1)

✔ Service deployed to stack haverklap-stripe-api-dev (196s)

endpoint: ANY - https://xxxxxxxxxx.execute-api.eu-west-1.amazonaws.com
functions:
  api: aws-node-express-api-project-dev-api (766 kB)
```
