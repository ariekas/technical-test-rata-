import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(context);
    const request = gqlCtx.getContext().req;

    const authorization = request.headers?.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new Error('Missing or invalid token');
    }

    const token = authorization.split(' ')[1];
    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001/graphql';

    try {
      const response = await fetch(authServiceUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
              validateToken(token: "${token}") {
                isValid
              }
            }
          `,
        }),
      });

      const result = await response.json();
      const isValid = result?.data?.validateToken?.isValid;

      if (!isValid) {
        throw new Error('Invalid token');
      }

      return true;
    } catch (error) {
      throw new Error('Authentication failed');
    }
  }
}
