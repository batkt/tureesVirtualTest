import _ from "lodash";

export default function compareFields(v1 = {}, v2 = {}, fields = []) {
  let res = false;
  fields.forEach((key) => {
    if ((_.isObject(v1[key]) || _.isArray(v1[key])) && res === false) {
      if (JSON.stringify(v1[key]) !== JSON.stringify(v2[key])) res = true;
    } else if (v1[key] !== v2[key] && res === false) {
      res = true;
    }
  });
  return res;
}
