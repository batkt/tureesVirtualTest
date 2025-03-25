import _ from "lodash";
import { toWords } from "mon_num";

function numberToWords(number, otion, bukhel, butarhai) {
  const { fixed, suffix } = otion;
  let resValue = number < 0 ? "хасах " : "";
  const value = (number < 0 ? (number * (-1)) : number)?.toFixed(fixed)?.toString();
  if (value?.includes(".")) {
    resValue = toWords(Number(value.split(".")[0]), { suffix });
    if (!!bukhel) resValue += ` ${bukhel}`;
    if (Number(value.split(".")[1]) > 0) {
      resValue += ` ${toWords(Number(value.split(".")[1]), { suffix })}`;
      if (!!butarhai) resValue += ` ${butarhai}`;
    }
  }
  return resValue;
}

export default numberToWords;
