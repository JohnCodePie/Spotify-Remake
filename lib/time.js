export function millisToMinutesAndSeconds(millis) {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return seconds == 60
    ? minutes + 1 + ":00"
    : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

export function translate(value, leftMin, leftMax, rightMin, rightMax) {
  // Figure out how 'wide' each range is
  const leftSpan = leftMax - leftMin;
  const rightSpan = rightMax - rightMin;

  // Convert the left range into a 0-1 range (float)
  const valueScaled = (value - leftMin) / leftSpan;

  // Convert the 0-1 range into a value in the right range.
  console.log("valueScaled: " + valueScaled);

  const ret = rightMin + valueScaled * rightSpan;

  return ret;
}
