import bcrypt from 'bcrypt';

export async function hashpassword(password: string): Promise<string> {
  const saltRound: number = Number(process.env.SALTROUND);
  const salt = await bcrypt.genSalt(saltRound);
  const result = await bcrypt.hash(password, salt);
  return result;
}

export async function checkpassword(
  password: string,
  encrypted: string
): Promise<boolean> {
  const result = await bcrypt.compare(password, encrypted);
  return result;
}
