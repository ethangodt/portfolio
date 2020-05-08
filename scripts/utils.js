export const delay = (wait) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, wait);
  });

// hacky tobacky
export const endlessly = (fn, interval) => {
  function loop() {
    fn();
    setTimeout(() => {
      loop();
    }, interval);
  }
  loop();
};
