import uilchilgee from "services/uilchilgee";
function erkhteiEsekh(token, zam) {
  return uilchilgee(token)
    .post("/erkhteiEsekh", { zam })
    .then(({ data }) => data);
}

export default erkhteiEsekh;
