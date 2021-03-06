import * as cdk from "@aws-cdk/core";
import { GraphAPI } from "./api";

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new GraphAPI(this, "cdk-bff");
  }
}
