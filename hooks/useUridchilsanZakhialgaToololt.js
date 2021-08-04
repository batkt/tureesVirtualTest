import { useEffect } from 'react'
import axios, { socket, aldaaBarigch } from 'services/uilchilgee'
import useSWR from 'swr'
import moment from 'moment'

const fetcher = (url, token, baiguullagiinId, ekhlekhOgnoo, duusakhOgnoo, ajiltniiId) => {
    return axios(token).post(url, {
        baiguullagiinId,
        ekhlekhOgnoo: moment(ekhlekhOgnoo).format("YYYY-MM-DD 00:00:00"),
        duusakhOgnoo: moment(duusakhOgnoo).format("YYYY-MM-DD 23:59:59"),
        ajiltniiId
    })
        .then(res => res.data).catch(aldaaBarigch)
}


function useUridchilsanZakhialgaToololt(token, baiguullagiinId, zakhialgaMutate, ekhlekhOgnoo, duusakhOgnoo, ajiltniiId) {
    const { data, mutate } = useSWR(!!token && !!baiguullagiinId ? ['/zakhialgiinTooAvya', token, baiguullagiinId, ekhlekhOgnoo, duusakhOgnoo, ajiltniiId] : null, fetcher, { revalidateOnFocus: false })

    useEffect(() => {
        if (!!baiguullagiinId) {
            socket().on(`baiguullaga${baiguullagiinId}`, (d) => {
                mutate(d, false)
                zakhialgaMutate((garalt) => ({ ...garalt, jagsaalt: [...garalt.jagsaalt] }))
            });
        }
    }, [baiguullagiinId])

    return {
        zakhialga: data?.find((mur) => mur._id.tuluv === "0")?.count || 0,
        tsagOirtson: data?.find((mur) => mur._id.tuluv === "1")?.count || 0,
        tsuglagdsan: data?.find((mur) => mur._id.tuluv === "3")?.count || 0,
        khuviarlagdaagui: data?.find((mur) => mur._id.tuluv === "0")?.count || 0,
        khuviarlagdsan: data?.find((mur) => mur._id.tuluv === "1")?.count || 0,
        ekhlesen: data?.find((mur) => mur._id.tuluv === "2")?.count || 0,
        duussan: data?.find((mur) => mur._id.tuluv === "3")?.count || 0,
        tsutslagdsan: data?.find((mur) => mur._id.tuluv === "-1")?.count || 0,
    }
}

export default useUridchilsanZakhialgaToololt