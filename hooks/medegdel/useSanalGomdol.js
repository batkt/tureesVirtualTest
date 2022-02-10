import axios, { socket,aldaaBarigch } from 'services/uilchilgee'
import useSWR from 'swr'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from 'services/auth'
import _ from 'lodash'

const fetcher = (url, token, khariltsagchiinId, { jagsaalt, ...khuudaslalt }) => axios(token).get(url, {params:{ ...khuudaslalt, query: {khariltsagchiinId }, order: {createdAt:-1, kharsanEsekh: 0 } }}).then(res => res.data).catch(aldaaBarigch)

const fetcherKhariltsagch = (url, token, register) => axios(token).get(url, {params:{query: {register }}}).then(res => res.data).catch(aldaaBarigch)

function useKhariltsagch (token, value){
    if(_.isObject(value))
        return value.khariltsagch
    const { data } = useSWR(!!token && !!value ? ['/khariltsagch', token, value] : null, fetcherKhariltsagch)
    const khariltsagch = useMemo(()=>{
        return _.get(data,'jagsaalt.0')
    },[data])
    return khariltsagch
}

function useSanalGomdol(token, value) {
    const khariltsagch = useKhariltsagch(token, value)
    const {baiguullaga} = useAuth()
    const [khuudaslalt, setKhuudaslalt] = useState({ khuudasniiDugaar: 1, khuudasniiKhemjee: 10, jagsaalt: [] })
    const { data, mutate } = useSWR(!!token && !!khariltsagch ? ['/sanalGomdol', token, khariltsagch?._id, khuudaslalt] : null, fetcher)

    function sonorduulgaKharlaa(id) {
        axios(token).post('/sanalKharlaa', { id })
            .then(({ data, status }) => {
                if (status === 200 && data === 'Amjilttai') {
                    mutate()
                }
            })
    }

    useEffect(()=>{
        setKhuudaslalt({ khuudasniiDugaar: 1, khuudasniiKhemjee: 10, search: "", jagsaalt: [] })
    },[value])

    useEffect(() => {
        if (baiguullaga?._id) {
            socket().on(`baiguullaga${baiguullaga?._id}`, sonorduulga => {
                if(sonorduulga.khariltsagchiinId === khariltsagch?._id)
                    mutate()
            })
        }
    }, [baiguullaga,khariltsagch,data])

    function nextSonorduulga() {
        if (data?.khuudasniiDugaar < data?.niitKhuudas)
            setKhuudaslalt(a => ({ ...a, khuudasniiDugaar: a.khuudasniiDugaar + 1, jagsaalt: [...khuudaslalt.jagsaalt, ...(data?.jagsaalt || [])] }))
    }

    function resetSonorduulga() {
        setKhuudaslalt({ khuudasniiDugaar: 1, khuudasniiKhemjee: 20, search: "", jagsaalt: [] })
        mutate()
    }

    return {khariltsagchiinId:khariltsagch?._id,firebaseToken:khariltsagch?.firebaseToken, setKhuudaslalt, sonorduulga: data, sonorduulgaMutate: mutate, jagsaalt: khuudaslalt.jagsaalt, resetSonorduulga, nextSonorduulga,sonorduulgaKharlaa }
}

export default useSanalGomdol