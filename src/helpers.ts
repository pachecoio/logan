import bcrypt from 'bcrypt';

export async function encrypt(password: string) {
  return await bcrypt.hash(password, Number(process.env.SALT));
}

export async function decrypt(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
