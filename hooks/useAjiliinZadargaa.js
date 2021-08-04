import { useState } from 'react'
import axios, { aldaaBarigch } from 'services/uilchilgee'
import useSWR from 'swr'

const fetcher = (url, token, baiguullagiinId, zakhialgaId) => {
    const query = {
        baiguullagiinId,
        _id:zakhialgaId
    };

    return axios(token).post(url, {query }).then(res => res.data).catch(aldaaBarigch)
}

function useZakhialga(token, baiguullagiinId, zakhialgaId) {
    const { data, mutate } = useSWR(!!token && !!baiguullagiinId ? ['/zakhialgiinJagsaaltAvya', token, baiguullagiinId,zakhialgaId] : null, fetcher, { revalidateOnFocus: false })
    return { zakhialgiinGaralt: data, zakhialgaMutate: mutate }
}

export default useZakhialga