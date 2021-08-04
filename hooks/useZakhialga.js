import { useState } from 'react'
import axios, { aldaaBarigch } from 'services/uilchilgee'
import useSWR from 'swr'

const fetcher = (url, token, baiguullagiinId, ajiltniiShuult = [], { search, ...khuudaslalt }, queryGaraasUgsun = {}) => {
    const query = {
        baiguullagiinId,
        tuluv: { $nin: ["3", "-1"] },
        "$or": [{ khariltsagchiinNer: { "$regex": search, "$options": 'i' } }, { khariltsagchiinUtas: { "$regex": search } }, { mashiniiDugaar: { "$regex": search } }],
        ...queryGaraasUgsun
    };
    if (ajiltniiShuult.length > 0) {
        query.ajiltniiId = { $in: ajiltniiShuult.map((x) => x._id) };
    }

    return axios(token).post(url, { order: { 'createdAt': -1 }, query, ...khuudaslalt }).then(res => res.data).catch(aldaaBarigch)
}

function useZakhialga(token, baiguullagiinId, ajiltniiShuult, queryGaraasUgsun) {
    const [khuudaslalt, setKhuudaslalt] = useState({ khuudasniiDugaar: 1, khuudasniiKhemjee: 10, search: "" })
    const { data, mutate } = useSWR(!!token && !!baiguullagiinId ? ['/zakhialgiinJagsaaltAvya', token, baiguullagiinId, ajiltniiShuult, khuudaslalt, queryGaraasUgsun] : null, fetcher, { revalidateOnFocus: false })
    return { setKhuudaslalt, zakhialgiinGaralt: data, zakhialgaMutate: mutate }
}

export default useZakhialga