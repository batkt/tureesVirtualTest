import uilchilgee from "services/uilchilgee";
function createMethod(modelName, token, data) {
  return uilchilgee(token).post(`/${modelName}`, data);
}

export default createMethod;
