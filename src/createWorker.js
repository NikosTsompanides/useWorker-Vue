// function to be your worker
function workerFunction(func) {
  const self = this;
  self.onmessage = function(e) {
    const data = func.apply(null, e.data);
    if (data instanceof Promise) {
      return data.then((res) => {
        self.postMessage(res);
      });
    }

    self.postMessage(data);
  };
}

export const createWorker = (func) => {
  const dataObj = `(${workerFunction})(${func})`;
  const blob = new Blob([dataObj.replace('"use strict";', "")]);

  const blobURL = (window.URL ? window.URL : window.webkitURL).createObjectURL(
    blob,
    {
      type: "application/javascript; charset=utf-8",
    }
  );

  return new Worker(blobURL);
};
