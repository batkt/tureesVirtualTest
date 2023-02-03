import uilchilgee from "services/uilchilgee";
function readMethod(modelName, token, id) {
  return uilchilgee(token).get(`/${modelName}/${id}`);
}

export default readMethod;
