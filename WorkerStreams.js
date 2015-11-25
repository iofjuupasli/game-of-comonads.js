export const create = (workerPath, message) => most.create(add => {
    const worker = new Worker(workerPath);
    worker.addEventListener('message', e => add(e.data));
    if (message != null) {
        worker.postMessage(message);
    }
    return () => worker.terminate();
});

export const listen => ctx => most.create(add => {
    const handler = e => add(e.data);
    ctx.addEventListener('message', handler);
    return () => ctx.removeEventListener('message', handler);
});
