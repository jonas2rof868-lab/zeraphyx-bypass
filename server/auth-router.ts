import { z } from 'zod';
import { publicProcedure, router } from './_core/trpc';
import { comparePassword, hashPassword } from './auth';
import { getAdminByUsername, getVendorByUsername, createVendor, getAllVendors, updateVendor, deleteVendor, getVendorUIDs } from './db';
import { TRPCError } from '@trpc/server';

const loginSchema = z.object({
  username: z.string().min(1, 'Usuário é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

const createVendorSchema = z.object({
  username: z.string().min(3, 'Usuário deve ter pelo menos 3 caracteres'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  uidLimit: z.number().min(1, 'Limite deve ser pelo menos 1'),
});

const updateVendorSchema = z.object({
  vendorId: z.number(),
  password: z.string().optional(),
  uidLimit: z.number().optional(),
});

export const authRouter = router({
  /**
   * Get current user session
   */
  me: publicProcedure.query(async ({ ctx }) => {
    const authCookie = ctx.req.headers.cookie?.split('; ').find(c => c.startsWith('auth_session='));
    if (!authCookie) {
      return null;
    }

    try {
      const sessionData = JSON.parse(Buffer.from(authCookie.split('=')[1], 'base64').toString());
      return sessionData;
    } catch {
      return null;
    }
  }),

  /**
   * Login for admin or vendor
   */
  login: publicProcedure
    .input(loginSchema)
    .mutation(async ({ input, ctx }) => {
      const { username, password } = input;

      // Try admin login first
      const admin = await getAdminByUsername(username);
      if (admin) {
        const isValidPassword = await comparePassword(password, admin.passwordHash);
        if (isValidPassword) {
          // Set session cookie for admin
          const sessionData = JSON.stringify({ type: 'admin', id: admin.id, username: admin.username });
          ctx.res.setHeader('Set-Cookie', `auth_session=${Buffer.from(sessionData).toString('base64')}; Path=/; HttpOnly; SameSite=Strict`);
          return {
            success: true,
            type: 'admin',
            username: admin.username,
          };
        }
      }

      // Try vendor login
      const vendor = await getVendorByUsername(username);
      if (vendor) {
        const isValidPassword = await comparePassword(password, vendor.passwordHash);
        if (isValidPassword) {
          // Set session cookie for vendor
          const sessionData = JSON.stringify({ type: 'vendor', id: vendor.id, username: vendor.username });
          ctx.res.setHeader('Set-Cookie', `auth_session=${Buffer.from(sessionData).toString('base64')}; Path=/; HttpOnly; SameSite=Strict`);
          return {
            success: true,
            type: 'vendor',
            username: vendor.username,
            vendorId: vendor.id,
          };
        }
      }

      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Usuário ou senha inválidos',
      });
    }),

  /**
   * Logout
   */
  logout: publicProcedure.mutation(({ ctx }) => {
    ctx.res.setHeader('Set-Cookie', 'auth_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
    return { success: true };
  }),

  /**
   * Admin: Create new vendor
   */
  addVendor: publicProcedure
    .input(createVendorSchema)
    .mutation(async ({ input }) => {
      const { username, password, uidLimit } = input;

      // Check if vendor already exists
      const existingVendor = await getVendorByUsername(username);
      if (existingVendor) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Usuário já existe',
        });
      }

      const passwordHash = await hashPassword(password);
      await createVendor(username, passwordHash, uidLimit);

      return { success: true, message: 'Vendedor criado com sucesso' };
    }),

  /**
   * Admin: Get all vendors
   */
  listVendors: publicProcedure.query(async () => {
    const vendors = await getAllVendors();
    return vendors.map(v => ({
      id: v.id,
      username: v.username,
      uidLimit: v.uidLimit,
      usedUids: v.usedUids,
      createdAt: v.createdAt,
    }));
  }),

  /**
   * Admin: Update vendor (password or limit)
   */
  editVendor: publicProcedure
    .input(updateVendorSchema)
    .mutation(async ({ input }) => {
      const { vendorId, password, uidLimit } = input;

      const updates: any = {};
      if (password) {
        updates.passwordHash = await hashPassword(password);
      }
      if (uidLimit !== undefined) {
        updates.uidLimit = uidLimit;
      }

      if (Object.keys(updates).length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Nenhuma atualização fornecida',
        });
      }

      await updateVendor(vendorId, updates);
      return { success: true, message: 'Vendedor atualizado com sucesso' };
    }),

  /**
   * Admin: Delete vendor
   */
  removeVendor: publicProcedure
    .input(z.object({ vendorId: z.number() }))
    .mutation(async ({ input }) => {
      await deleteVendor(input.vendorId);
      return { success: true, message: 'Vendedor deletado com sucesso' };
    }),

  /**
   * Vendor: Get their UIDs
   */
  myUIDs: publicProcedure
    .input(z.object({ vendorId: z.number() }))
    .query(async ({ input }) => {
      return await getVendorUIDs(input.vendorId);
    }),
});
