import * as cdk from "@aws-cdk/core";
import * as apigw from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";

export class GraphAPI extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props?: any) {
    super(scope, id);

    const func = new lambda.Function(this, "cdk-bffhandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("../backend/dist"),
      handler: "server.main",
    });

    const api = new apigw.LambdaRestApi(this, "cdk-bffAPI", {
      handler: func,
      proxy: false,
      deployOptions: {
        stageName: "dev",
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS, // this is also the default
      },
    });

    api.root.addMethod("ANY");
    const items = api.root.addResource("graphql");
    items.addMethod("GET"); // GET /items
    items.addMethod("POST"); // POST /items

    new cdk.CfnOutput(this, "APIEndpoint", {
      value: api.url!,
      exportName: "APIEndpoint",
    });
  }
}
