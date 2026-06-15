import { auth } from '~~/lib/auth';
import { pijpService } from '#server/services/pijp.service';

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' });
  }

  const body = await readBody<{ naam: string; moyenne: number }>(event);
  return pijpService.updateSpeler(id, body.naam, body.moyenne);
});
