import { auth } from '~~/lib/auth';
import { pijpService } from '#server/services/pijp.service';

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  return pijpService.generateAndSaveWedstrijden();
});
