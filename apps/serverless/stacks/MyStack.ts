import { Api, StackContext } from 'sst/constructs';

export function API({ stack }: StackContext) {
  const api = new Api(stack, 'api', {
    routes: {
      'GET /': 'src/hello.handler',
      'GET /doggos': 'src/doggos.handler',
    },
  });
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
