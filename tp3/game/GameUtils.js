export function parseTime(time) {
  if (time < 0) return ["0", "0"];
  const minute = Math.floor((time / 1000 / 60) << 0);
  const seconds = Math.floor((time / 1000) % 60);
  return [minute.toString(), seconds.toString()];
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}