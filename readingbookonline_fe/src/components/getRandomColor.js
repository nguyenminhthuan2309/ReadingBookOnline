export const getRandomColor = () => {
  let color;
  do {
    color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random hex color
  } while (
    color === "#ffffff" ||
    color === "#000000" ||
    getLuminance(color) < 40 ||
    getLuminance(color) > 200
  );
  return color;
};

const getLuminance = (hex) => {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 255;
  const g = (rgb >> 8) & 255;
  const b = rgb & 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}