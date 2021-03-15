import * as cdk from "@aws-cdk/core";
import { Construct } from "@aws-cdk/core";
import * as path from "path";
import { DockerImageAsset } from "@aws-cdk/aws-ecr-assets";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecsp from "@aws-cdk/aws-ecs-patterns";
import * as ecs from "@aws-cdk/aws-ecs";

export interface WebServerProps {
  vpc: ec2.IVpc;
}

export class WebServer extends Construct {
  constructor(scope: Construct, id: string, props: WebServerProps) {
    super(scope, id);

    const webserverDocker = new DockerImageAsset(this, "LguerraDockerAsset", {
      directory: path.join(__dirname, "..", "..", "backend"),
    });

    const fargateService = new ecsp.ApplicationLoadBalancedFargateService(
      this,
      "lguerraWebserverFargate",
      {
        vpc: props.vpc,
        taskImageOptions: {
          image: ecs.ContainerImage.fromDockerImageAsset(webserverDocker),
          environment: {
            SERVER_PORT: "8080",
          },
          containerPort: 8080,
        },
      }
    );

    new cdk.CfnOutput(this, "lguerraWebserverHost", {
      exportName: "lguerraWebserverHost",
      value: fargateService.loadBalancer.loadBalancerDnsName,
    });
  }
}
