import uilchilgee from 'services/uilchilgee'
function deleteMethod(modelName, token, id) {
    return uilchilgee(token).delete(`/${modelName}/${id}`)
}

export default deleteMethod