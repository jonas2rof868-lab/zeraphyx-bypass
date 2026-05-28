import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a password with its hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a hash for the default admin password
 * This is used to pre-generate the hash for insertion
 */
export async function generateAdminHash(): Promise<void> {
  const hash = await hashPassword('BR@Zeraphyx');
  console.log('Admin password hash:', hash);
}
