module.exports = {
  DOMMatrix:
    typeof globalThis.DOMMatrix !== "undefined"
      ? globalThis.DOMMatrix
      : class DOMMatrix {},
  createCanvas: () => ({}),
  loadImage: () => Promise.resolve({}),
};
