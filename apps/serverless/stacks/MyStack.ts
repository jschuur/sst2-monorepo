import fs from 'fs-extra';
import * as path from 'path';

import * as lambda from 'aws-cdk-lib/aws-lambda';

import { Api, StackContext } from 'sst/constructs';

export function API({ stack, app }: StackContext) {
  // via https://github.com/serverless-stack/sst/blob/master/examples/prisma/stacks/MyStack.ts
  if (!app.local) {
    // Create a layer for production
    // This saves shipping Prisma binaries once per function

    // in a monorepo, use root node_modules dir
    const prismaNodeModulesParent = '../..';
    const layerPath = '.sst/layers/prisma';

    // Clear out the layer path
    fs.removeSync(layerPath);
    fs.mkdirSync(layerPath, { recursive: true });

    // Copy files to the layer
    const toCopy = [
      // hardcode this until I figure out why copySync doesn't like symlinked folders
      'node_modules/@prisma',
      'node_modules/prisma',
    ];

    for (const file of toCopy) {
      const from = path.join(prismaNodeModulesParent, file);
      const to = path.join(layerPath, 'nodejs', file);

      console.log(`Copying ${from} to ${to}`);

      fs.copySync(from, to, {
        // Do not include binary files that aren't for AWS to save space
        filter: (src: string) => {
          console.log(`File ${src}`);
          return !src.endsWith('so.node') || src.includes('rhel');
        },
      });
    }

    const prismaLayer = new lambda.LayerVersion(stack, 'PrismaLayer', {
      code: lambda.Code.fromAsset(path.resolve(layerPath)),
    });

    // Add to all functions in this stack
    stack.addDefaultFunctionLayers([prismaLayer]);
  }

  const api = new Api(stack, 'api', {
    defaults: {
      function: {
        // environment: {
        //   DATABASE_URL: process.env.DATABASE_URL,
        // },
        nodejs: {
          // Only reference external modules when deployed
          install: app.local ? [] : ['@prisma/client', 'prisma'],
        },
      },
    },
    routes: {
      'GET /': 'src/doggos.handler',
      'GET /hello': 'src/hello.handler',
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
