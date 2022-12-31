 
/**
 * @param {Integer} time 
 * @returns time string in minutes and seconds
 */
export function parseTime(time) {
  if (time < 0) return ["0", "0"];
  const minute = Math.floor((time / 1000 / 60) << 0);
  const seconds = Math.floor((time / 1000) % 60);
  return [minute.toString(), seconds.toString()];
}

/**
 * @param {Integer} min
 * @param {Integer} max
 * @returns random integer between min and max
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}