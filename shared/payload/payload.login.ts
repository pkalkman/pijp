import { z } from 'zod';

export const payloadLoginSchema = z.object({
  email: z.email('Ongeldig e-mailadres'),
  password: z.string().min(1, 'Verplicht').max(256, 'Vereist'),
});
