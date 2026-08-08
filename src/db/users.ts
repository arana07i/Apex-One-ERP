import { db } from './index.ts';
import { users } from './schema.ts';

export async function getOrCreateUser(uid: string, email: string) {
  try {
    const result = await db
      .insert(users)
      .values({
        id: `usr-${Date.now()}`,
        uid,
        email,
        name: email.split('@')[0] || 'User',
        role: 'Admin',
        department: 'Executive Operations',
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw new Error('Database operation failed in getOrCreateUser', { cause: error });
  }
}
