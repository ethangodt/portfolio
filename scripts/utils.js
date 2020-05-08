export const delay = (wait) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, wait);
  });

export const hackyTobacky = (fn, interval, times) => {
  let count = 0;
  function loop() {
    count++;
    fn();
    setTimeout(() => {
      if (count < times) {
        loop();
      }
    }, interval);
  }
  loop();
};
