import { Construct } from "@aws-cdk/core";
import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as path from "path";

export class CDN extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      bucketName: "lguerra-cdn",
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: true,

      // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
      // the new bucket, and it will remain in your account until manually deleted. By setting the policy to
      // DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });
    new cdk.CfnOutput(this, "Bucket", { value: siteBucket.bucketName });

    // CloudFront distribution that provides HTTPS
    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "LguerraCDNSiteDistribution",
      {
        // aliasConfiguration: {
        //   // acmCertRef: certificate.certificateArn,
        //   // names: [siteDomain],
        //   sslMethod: cloudfront.SSLMethod.SNI,
        //   securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016,
        // },
        defaultRootObject: "index.html",
        errorConfigurations: [
          {
            errorCode: 403,
            responseCode: 200,
            errorCachingMinTtl: 1,
            responsePagePath: "/index.html",
          },
          {
            errorCode: 404,
            responseCode: 200,
            errorCachingMinTtl: 1,
            responsePagePath: "/index.html",
          },
        ],
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: siteBucket,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );
    new cdk.CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    });
    new cdk.CfnOutput(this, "DistributionName", {
      value: distribution.distributionDomainName,
      exportName: "DistributionName",
    });

    // Deploy site contents to S3 bucket
    new s3deploy.BucketDeployment(this, "DeployWithInvalidation", {
      // sources: [s3deploy.Source.asset("../frontend/dist/aws-cdk-angular")],
      sources: [
        s3deploy.Source.asset(
          path.join(__dirname, "..", "..", "frontend", "dist")
        ),
      ],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
