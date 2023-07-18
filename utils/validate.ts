import { ZodSchema } from 'zod';

function validate<T>(schema: ZodSchema<T>, data: any) {
  return schema.parse(data);
}

export default validate;
