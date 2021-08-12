import uilchilgee from 'services/uilchilgee'
function updateMethod(modelName, token, data) {
    return uilchilgee(token).put(`/${modelName}/${data}`, data)
}

export default updateMethod