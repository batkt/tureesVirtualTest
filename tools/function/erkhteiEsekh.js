import uilchilgee from "services/uilchilgee";

function erkhteiEsekh(token, zam) {
  return uilchilgee(token)
    .post(`${"https://turees.zevtabs.mn/api"}/erkhteiEsekh`, { zam })
    .then(({ data }) => data);
}

export default erkhteiEsekh;
