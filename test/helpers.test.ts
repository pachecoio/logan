import { decrypt, encrypt } from '../src/helpers';

describe('Test encryption', () => {
  beforeEach(() => {
    process.env.SALT = 'SALT';
  });

  it('should encrypt and decrypt the correct string', async () => {
    const text = 'testing';
    const encrypted = await encrypt(text);
    expect(encrypted).not.toBe(text);
    const valid = await decrypt(text, encrypted);
    expect(valid).toBeTruthy();
  });

  it('should fail decrypting invalid value', async () => {
    const text = 'testing';
    const encrypted = await encrypt('INVALID VALUE');
    expect(await decrypt(text, encrypted)).toBeFalsy();
  });
});
