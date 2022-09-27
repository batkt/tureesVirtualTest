import uilchilgee from "services/uilchilgee";
import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();
function erkhteiEsekh(token, zam) {
  return uilchilgee(token)
    .post(
      `${
        serverRuntimeConfig.HTTP_URL || "http://103.143.40.230:8081"
      }/erkhteiEsekh`,
      { zam }
    )
    .then(({ data }) => data);
}

export default erkhteiEsekh;
