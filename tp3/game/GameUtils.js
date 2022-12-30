export function parseTime(time) {
  if (time < 0) return ["0", "0"];
  const minute = Math.floor((time / 1000 / 60) << 0);
  const seconds = Math.floor((time / 1000) % 60);
  return [minute.toString(), seconds.toString()];
}

export function angle(a, b) {
  let ax = a[0],
    ay = a[1],
    az = a[2],
    bx = b[0],
    by = b[1],
    bz = b[2],
    mag1 = Math.sqrt(ax * ax + ay * ay + az * az),
    mag2 = Math.sqrt(bx * bx + by * by + bz * bz),
    mag = mag1 * mag2,
    cosine = mag && vec3.dot(a, b) / mag;
  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}