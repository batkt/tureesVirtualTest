import axios, { aldaaBarigch } from 'services/uilchilgee'
import zakhialgiinTsaguudOlyo from 'tools/function/zakhialgiinTsaguudOlyo'
import useSWR from 'swr'

const fetcher = (url, token, baiguullagiinId) => axios(token).post(url, { query: { baiguullagiinId } }).then(res => res.data).catch(aldaaBarigch)

function useZakhialgiinTsag(token, baiguullaga, ognoo) {
    const { data, mutate } = useSWR(!!token && !!baiguullaga ? ['/zakhialgiinTsagiinKhuvaariAvya', token, baiguullaga._id] : null, fetcher, { revalidateOnFocus: false })
    if (!baiguullaga)
        return { tsagiinJagsaalt: [] }
    return {
        tsagiinJagsaalt: zakhialgiinTsaguudOlyo(
            ognoo,
            baiguullaga,
            data
        ),
        tsagMutate: mutate
    }
}

export default useZakhialgiinTsag