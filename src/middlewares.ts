import { verify } from './auth';
import { HttpRequestError } from './exceptions';

export const auth = {
  require(): MethodDecorator {
    return function(
      _target: Object,
      _propertyKey: string | symbol,
      descriptor: PropertyDescriptor
    ) {
      const original = descriptor.value;
      descriptor.value = async function(...args: any[]) {
        const [request, response] = args;
        try {
          const { valid, ...verified } = await verify(request.headers);
          if (!valid) throw new HttpRequestError(401, verified.message);
          return original.apply(this, args);
        } catch (error) {
          console.log('auth error', error);
          return response.status(401).send({
            error: true,
            message: error.message,
          });
        }
      };
    };
  },
};
