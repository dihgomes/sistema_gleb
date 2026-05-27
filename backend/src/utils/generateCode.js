import crypto from 'crypto';

function generateUniqueCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  
  const randomBytes = crypto.randomBytes(16);
  
  for (let i = 0; i < 16; i++) {
    code += chars[randomBytes[i] % chars.length];
  }
  
  return code;
}

export { generateUniqueCode };
