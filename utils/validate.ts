import { ZodSchema } from 'zod';

function validate(schema: ZodSchema, data: any) {
  return schema.parse(data);
}

export default validate;
