import { useState } from 'react'
import axios, { aldaaBarigch } from 'services/uilchilgee'
import useSWR from 'swr'

const fetcher = (url, token, { search, ...khuudaslalt }) => axios(token).post(url, { order: { 'createdAt': -1 }, query: { "$or": [{ ner: { "$regex": search, "$options": 'i' } }, { utas: { "$regex": search } }, { "mashinuud.dugaar": { "$regex": search, "$options": 'i' } }] }, ...khuudaslalt }).then(res => res.data).catch(aldaaBarigch)

function useKhariltsagch(token, khuudaslaltAnkhniiUtga = {}) {
    const [khuudaslalt, setKhuudaslalt] = useState({ khuudasniiDugaar: 1, khuudasniiKhemjee: 10, search: "", ...khuudaslaltAnkhniiUtga })
    const { data, mutate } = useSWR(!!token ? ['/khariltsagchiinJagsaaltAvya', token, khuudaslalt] : null, fetcher, { revalidateOnFocus: false })
    return { setKhuudaslalt, khariltsagchiinGaralt: data, khariltsagchMutate: mutate }
}

export default useKhariltsagch