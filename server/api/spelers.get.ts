import { pijpService } from '#server/services/pijp.service';

export default defineEventHandler(async () => {
  return pijpService.getAllSpelers();
});
