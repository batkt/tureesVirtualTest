// Stub for react-plotly.js on server-side (browser-only library)
// This prevents "self is not defined" errors during SSR

const PlotStub = function Plot() {
  return null;
};

// Match the default export structure of react-plotly.js
module.exports = PlotStub;
module.exports.default = PlotStub;

// Also support ES module exports
if (typeof exports !== 'undefined') {
  exports.default = PlotStub;
}