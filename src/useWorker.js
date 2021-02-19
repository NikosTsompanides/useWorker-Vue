import { createWorker } from "./createWorker";

export const useWorker = function(func) {
  const worker = createWorker(func);

  return function(...args) {
    worker.postMessage(args);
    

    return new Promise((resolve, reject) => {
      worker.onmessage = (e) => {
        worker.terminate()
        resolve(e.data);
      };

      worker.onerror = (e) => {
        worker.terminate()
        reject(e.error);
      };
    });
  };
};
