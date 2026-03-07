export default defineEventHandler(async (event) => {
  const stream = createEventStream(event);

  const unsubscribe = onSseEvent((type, data) => {
    stream.push({ event: type, data: JSON.stringify(data) }).catch(() => {});
  });

  stream.onClosed(unsubscribe);

  return stream.send();
});
