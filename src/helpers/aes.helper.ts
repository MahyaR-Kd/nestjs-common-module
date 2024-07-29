import * as crypto from 'crypto';

export class AesHelper {
  // Encryption function
  static encrypt(text: string, secretKey: string): string {
    if (!text) return undefined;
    const iv = crypto.randomBytes(16); // Generate a random IV
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(secretKey),
      iv,
    );
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + encrypted;
  }

  // Decryption function
  static decrypt(encryptedText: string, secretKey: string): string {
    const iv = Buffer.from(encryptedText.slice(0, 32), 'hex'); // Extract IV from the encrypted text
    const encryptedData = encryptedText.slice(32); // Extract the encrypted data
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(secretKey),
      iv,
    );
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
