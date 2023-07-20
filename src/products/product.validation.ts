import { z } from 'zod';

export const CreateProductValidation = z.object({
  name: z
    .string({
      required_error: 'name is required',
    })
    .trim(),
  description: z.string({
    required_error: 'description is required',
  }),
  stock: z
    .number({
      required_error: 'stock is required',
    })
    .min(0)
    .positive(),
  price: z
    .number({
      required_error: 'price is required',
    })
    .min(0)
    .positive(),
});
