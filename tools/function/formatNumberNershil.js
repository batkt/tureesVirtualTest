import _ from "lodash";

const toonNershil = ["", "мянга", "сая", "тэрбум", "их наяд"];
function formatNumberNershil(number, fixed = 0) {
  var nariivchlal = (Math.log10(Math.abs(number)) / 3) | 0;

  if (nariivchlal == 0) return number;

  var suffix = toonNershil[nariivchlal];
  var scale = Math.pow(10, nariivchlal * 3);

  var scaled = number / scale;

  return scaled.toFixed(1) + suffix;
}

export default formatNumberNershil;
