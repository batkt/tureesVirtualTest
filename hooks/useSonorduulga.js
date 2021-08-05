import { notification } from 'antd'
import axios, { socket, aldaaBarigch } from 'services/uilchilgee'
import useSWR from 'swr'
import Sonorduulga from 'components/sonorduulga'
import { useEffect, useState } from 'react'
const fetcher = (url, token, ajiltniiId, { jagsaalt, ...khuudaslalt }) => axios(token).post(url, { ...khuudaslalt, query: { ajiltniiId }, order: { kharsanEsekh: 0 } }).then(res => res.data).catch(aldaaBarigch)
var sonorduulgaId = null

function useSonorduulga(token, ajiltniiId) {
    const [khuudaslalt, setKhuudaslalt] = useState({ khuudasniiDugaar: 1, khuudasniiKhemjee: 10, jagsaalt: [] })
    const { data, mutate } = {}

    return { setKhuudaslalt, sonorduulga: data, sonorduulgaMutate: mutate, jagsaalt: khuudaslalt.jagsaalt }
}

export default useSonorduulga