import { describe, expect, it, vi } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

function createContext(): TrpcContext {
  const headers: Record<string, string> = {};
  
  const res = {
    setHeader: vi.fn((name: string, value: string) => {
      headers[name.toLowerCase()] = value;
    }),
  } as any as TrpcContext['res'];

  const req = {
    headers: {},
  } as TrpcContext['req'];

  return {
    user: null,
    req,
    res,
  };
}

describe('auth.login', () => {
  it('should login successfully with correct admin credentials', async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.login({
      username: 'Zeraphyx',
      password: 'BR@Zeraphyx',
    });

    expect(result.success).toBe(true);
    expect(result.type).toBe('admin');
    expect(result.username).toBe('Zeraphyx');
    expect(ctx.res.setHeader).toHaveBeenCalled();
  }, { timeout: 10000 });

  it('should fail with incorrect password', async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.auth.login({
        username: 'Zeraphyx',
        password: 'wrongpassword',
      });
      expect.fail('Should have thrown an error');
    } catch (error: any) {
      expect(error.message).toContain('Usuário ou senha inválidos');
    }
  }, { timeout: 10000 });

  it('should fail with non-existent user', async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.auth.login({
        username: 'nonexistent',
        password: 'password123',
      });
      expect.fail('Should have thrown an error');
    } catch (error: any) {
      expect(error.message).toContain('Usuário ou senha inválidos');
    }
  }, { timeout: 10000 });
});
