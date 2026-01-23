
import { z } from 'zod';
import { insertAssetSchema, insertCampaignSchema, insertVerificationSchema, insertVerificationItemSchema, users, assets, campaigns, verifications, verificationItems } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: z.object({
        role: z.enum(['finance', 'manager', 'employee']),
        username: z.string().optional(),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.validation,
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.validation,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
  },
  dashboard: {
    stats: {
      method: 'GET' as const,
      path: '/api/dashboard/stats',
      responses: {
        200: z.object({
          totalAssets: z.number(),
          verificationCompleted: z.number(),
          pendingVerifications: z.number(),
          exceptions: z.number(),
        }),
      },
    },
  },
  assets: {
    list: {
      method: 'GET' as const,
      path: '/api/assets',
      input: z.object({
        search: z.string().optional(),
        status: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof assets.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/assets',
      input: insertAssetSchema,
      responses: {
        201: z.custom<typeof assets.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/assets/:id',
      input: insertAssetSchema.partial(),
      responses: {
        200: z.custom<typeof assets.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/assets/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  reports: {
    get: {
      method: 'GET' as const,
      path: '/api/reports/:type',
      responses: {
        200: z.array(z.any()),
        404: errorSchemas.notFound,
      },
    },
  },
  campaigns: {
    list: {
      method: 'GET' as const,
      path: '/api/campaigns',
      responses: {
        200: z.array(z.custom<typeof campaigns.$inferSelect>()),
      },
    },
    getActive: {
      method: 'GET' as const,
      path: '/api/campaigns/active',
      responses: {
        200: z.custom<typeof campaigns.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  verifications: {
    list: {
      method: 'GET' as const,
      path: '/api/verifications',
      responses: {
        200: z.array(z.custom<typeof verifications.$inferSelect & { user: typeof users.$inferSelect }>()),
      },
    },
    submit: {
      method: 'POST' as const,
      path: '/api/verifications',
      input: z.object({
        campaignId: z.number(),
        items: z.array(z.object({
          assetId: z.number().optional(),
          peripheralName: z.string().optional(),
          isPresent: z.boolean(),
          photoUrl: z.string().optional(),
        })),
      }),
      responses: {
        201: z.custom<typeof verifications.$inferSelect>(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
