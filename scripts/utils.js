export const delay = (wait) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, wait);
  });
