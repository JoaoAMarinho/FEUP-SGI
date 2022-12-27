export function parseTime(time) {
  if (time < 0) return ["0", "0"];
  const minute = Math.floor((time / 1000 / 60) << 0);
  const seconds = Math.floor((time / 1000) % 60);
  return [minute.toString(), seconds.toString()];
}