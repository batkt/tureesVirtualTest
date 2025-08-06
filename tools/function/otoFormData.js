import _ from "lodash";

function setForm(form, zam, v) {
  if (!!v) form.append(zam, v);
}

function convert(form, zam, o) {
  for (let k in o) {
    if (_.isArray(o[k]) || _.isObject(o[k]))
      convert(form, `${zam}[${k}]`, o[k]);
    else setForm(form, `${zam}[${k}]`, o[k]);
  }
}

function otoFormData(o) {
  let formData = new FormData();
  for (let k in o) {
    if (_.isArray(o[k]) || _.isObject(o[k])) convert(formData, `${k}`, o[k]);
    else setForm(formData, `${k}`, o[k]);
  }

  return formData;
}

export default otoFormData;
