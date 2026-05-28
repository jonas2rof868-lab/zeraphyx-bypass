import { z } from 'zod';
import { publicProcedure, router } from './_core/trpc';
import { createUID, updateUID, getVendorUIDs, updateVendor, getDb } from './db';
import { TRPCError } from '@trpc/server';
import axios from 'axios';
import { vendors, uids } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const API_KEY = 'uid_inzA4Icak9ZORrm1d2eE_MRDri3YPoL3';
const ADD_UID_API_URL = 'http://painel.reflexo-games.com/api/add_uid';
const CHANGE_UID_API_URL = 'http://painel.reflexo-games.com/api/change_uid';

const PRICING = {
  1: 0.5,
  7: 0.5,
  30: 1,
};

const addUIDSchema = z.object({
  vendorId: z.number(),
  accountId: z.string().min(1, 'ID da conta é obrigatório'),
  durationDays: z.enum(['1', '7', '30']).transform(v => parseInt(v)),
});

const changeUIDSchema = z.object({
  uidId: z.number(),
  newAccountId: z.string().min(1, 'Novo ID é obrigatório'),
});

export const uidRouter = router({
  /**
   * Add a new UID via external API
   */
  addUID: publicProcedure
    .input(addUIDSchema)
    .mutation(async ({ input }) => {
      const { vendorId, accountId, durationDays } = input;

      try {
        // Get vendor info to check limit
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Banco de dados indisponível',
          });
        }

        const vendorResult = await db.select().from(vendors).where(eq(vendors.id, vendorId)).limit(1);
        const vendor = vendorResult[0];

        if (!vendor) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Vendedor não encontrado',
          });
        }

        // Check if vendor has reached their limit
        const cost = PRICING[durationDays as keyof typeof PRICING];
        const newUsedUids = (vendor.usedUids || 0) + cost;

        if (newUsedUids > vendor.uidLimit) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Limite de UIDs atingido. Você tem ${vendor.usedUids}/${vendor.uidLimit} UIDs usados.`,
          });
        }

        // Call external API
        const response = await axios.post(
          ADD_UID_API_URL,
          {
            account_id: accountId,
            for_days: durationDays,
          },
          {
            headers: {
              'X-API-KEY': API_KEY,
              'Content-Type': 'application/json',
            },
            timeout: 10000,
          }
        );

        const data = response.data;

        if (!data.success) {
          const errorCode = data.code || 'UNKNOWN_ERROR';
          let errorMessage = data.message || 'Erro desconhecido';

          // Map error codes to friendly messages
          if (errorCode === 'ALREADY_ACTIVE') {
            errorMessage = 'Este UID já está ativo no sistema.';
          } else if (errorCode === 'INSUFFICIENT_RESOURCES') {
            errorMessage = 'Créditos/limite insuficiente para adicionar este UID.';
          } else if (response.status === 401) {
            errorMessage = 'Chave de API inválida. Contate o administrador.';
          } else if (response.status === 400) {
            errorMessage = `Requisição inválida: ${errorMessage}`;
          }

          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: errorMessage,
          });
        }

        // Calculate expiry date
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + durationDays);

        // Save to database
        await createUID(vendorId, accountId, durationDays, expiresAt);

        // Update vendor's used UIDs count
        await updateVendor(vendorId, {
          usedUids: newUsedUids,
        });

        return {
          success: true,
          message: `UID ${accountId} registrado com sucesso por ${durationDays} dia(s)!`,
          data: {
            accountId,
            durationDays,
            expiresAt,
          },
        };
      } catch (error: any) {
        if (error instanceof TRPCError) {
          throw error;
        }

        if (error.code === 'ECONNREFUSED') {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Falha ao conectar com a API. O servidor pode estar indisponível.',
          });
        }

        if (error.code === 'ENOTFOUND') {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Falha ao conectar com a API. Verifique a URL do endpoint.',
          });
        }

        if (error.code === 'ETIMEDOUT') {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Timeout na requisição. A API está respondendo lentamente.',
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Erro ao comunicar com a API.',
        });
      }
    }),

  /**
   * Change an existing UID via external API
   */
  changeUID: publicProcedure
    .input(changeUIDSchema)
    .mutation(async ({ input }) => {
      const { uidId, newAccountId } = input;

      try {
        // Get current UID info from database
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Banco de dados indisponível',
          });
        }

        const uidResult = await db.select().from(uids).where(eq(uids.id, uidId)).limit(1);
        const currentUID = uidResult[0];

        if (!currentUID) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'UID não encontrado',
          });
        }

        // Call external API
        const response = await axios.post(
          CHANGE_UID_API_URL,
          {
            account_id: newAccountId,
            for_days: currentUID.durationDays,
          },
          {
            headers: {
              'X-API-KEY': API_KEY,
              'Content-Type': 'application/json',
            },
            timeout: 10000,
          }
        );

        const data = response.data;

        if (!data.success) {
          const errorCode = data.code || 'UNKNOWN_ERROR';
          let errorMessage = data.message || 'Erro desconhecido';

          if (errorCode === 'ALREADY_ACTIVE') {
            errorMessage = 'Este UID já está ativo no sistema.';
          } else if (errorCode === 'INSUFFICIENT_RESOURCES') {
            errorMessage = 'Créditos/limite insuficiente.';
          } else if (response.status === 401) {
            errorMessage = 'Chave de API inválida.';
          }

          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: errorMessage,
          });
        }

        // Update in database
        await updateUID(uidId, {
          accountId: newAccountId,
        });

        return {
          success: true,
          message: `UID alterado para ${newAccountId} com sucesso!`,
          data: {
            accountId: newAccountId,
          },
        };
      } catch (error: any) {
        if (error instanceof TRPCError) {
          throw error;
        }

        if (error.code === 'ECONNREFUSED') {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Falha ao conectar com a API.',
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Erro ao comunicar com a API.',
        });
      }
    }),

  /**
   * Get pricing information
   */
  getPricing: publicProcedure.query(() => {
    return PRICING;
  }),
});
