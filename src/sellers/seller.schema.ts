import { z } from 'zod';

export const CreateSellerSchema = z.object({
  domain: z
    .string({
      required_error: 'domain is required',
    })
    .min(1)
    .trim()
    .toLowerCase(),
  name: z
    .string({
      required_error: 'name is required',
    })
    .min(1)
    .trim(),
  email: z
    .string({
      required_error: 'email is required',
    })
    .email()
    .trim(),
  phone: z.string().optional(),
  description: z.string().optional(),
  password: z
    .string({
      required_error: 'password is required',
    })
    .min(1)
    .trim(),
});

export type CreateSellerSchemaType = z.infer<typeof CreateSellerSchema>;
