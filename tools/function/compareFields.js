export default function compareFields(v1={},v2={},fields=[]) {
    let res = false
    fields.forEach((key)=>{
        if(v1[key] !== v2[key] && res === false){
            res = true
        }
    })
    return res
}