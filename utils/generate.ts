import { customAlphabet } from 'nanoid';

const generate = customAlphabet(
  '123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  25
);

export default generate;
