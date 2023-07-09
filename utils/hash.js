import crypto from 'crypto';

export default function hashData(data, algorithm) {
  const hash = crypto.createHash(algorithm);
  hash.update(data);
  return hash.digest('hex');
}