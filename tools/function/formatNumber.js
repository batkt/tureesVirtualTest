function formatNumber(num, fixed = 0) {
  if (num === undefined || num === null || num === "") return "0.00";
  var fixedNum = parseFloat(num).toFixed(fixed).toString();
  var numSplit = fixedNum.split(".");
  if (numSplit === null || numSplit.length === 0) {
    return "0.00";
  }
  var firstFormatNum = numSplit[0]
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  if (fixed === 0) return firstFormatNum;
  return firstFormatNum + "." + numSplit[1];
}

export default formatNumber