import * as cdk from "@aws-cdk/core";
import { Tags } from "@aws-cdk/core";
import { GraphAPI } from "./api";
import { Networking } from "./networking";
import { WebServer } from "./server";

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // INFO: using lambda
    const api = new GraphAPI(this, "cdk-bff");

    const networking = new Networking(this, "NetworkingConstruct", {
      maxAzs: 2,
    });

    // INFO: Using Fargate and Docker
    const webserver = new WebServer(this, "LguerraWebServer", {
      vpc: networking.vpc,
    });
    Tags.of(webserver).add("Module", "webserver");
  }
}
