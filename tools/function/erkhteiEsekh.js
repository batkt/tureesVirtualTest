import uilchilgee from "services/uilchilgee";

function erkhteiEsekh(token, zam) {
  return uilchilgee(token)
    .post(
      `${
        process.env.HTTP_URL || "http://103.143.40.230:8081"
      }/erkhteiEsekh`,
      { zam }
    )
    .then(({ data }) => data);
}

export default erkhteiEsekh;
