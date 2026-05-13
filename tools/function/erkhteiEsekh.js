import uilchilgee from "services/uilchilgee";

function erkhteiEsekh(token, zam) {
  return uilchilgee(token)
    .post(
      `${process.env.HTTP_URL || "http://103.48.116.100:8081"}/erkhteiEsekh`,
      { zam },
    )
    .then(({ data }) => data);
}

export default erkhteiEsekh;
