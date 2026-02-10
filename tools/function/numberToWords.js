import _ from "lodash";
import { toWords } from "mon_num";

function numberToWords(number, otion, bukhel, butarhai) {
  if (number === null || number === undefined || number === '') {
    return '';
  }

  const numValue = Number(number);
  
  if (isNaN(numValue)) {
    console.warn('numberToWords: Invalid number provided:', number);
    return '';
  }

  const { fixed, suffix } = otion;
  let resValue = numValue < 0 ? "хасах " : "";
  const absValue = Math.abs(numValue);
  const value = absValue.toFixed(fixed).toString();
  
  if (value.includes(".")) {
    resValue += toWords(Number(value.split(".")[0]), { suffix });
    if (bukhel) resValue += ` ${bukhel}`;
    if (Number(value.split(".")[1]) > 0) {
      resValue += ` ${toWords(Number(value.split(".")[1]), { suffix })}`;
      if (butarhai) resValue += ` ${butarhai}`;
    }
  }
  
  return resValue;
}

export default numberToWords;