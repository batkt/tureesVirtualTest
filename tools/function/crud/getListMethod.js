import uilchilgee from "services/uilchilgee";
function getListMethod(modelName, token, data) {
  return uilchilgee(token).get(`/${modelName}`, { params: data });
}

export default getListMethod;
