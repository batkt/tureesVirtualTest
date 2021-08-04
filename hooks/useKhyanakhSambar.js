import axios, { aldaaBarigch } from 'services/uilchilgee'
import useSWR from 'swr'

const fetcher = (url, token) => axios(token).post(url).then(res => res.data).catch(aldaaBarigch)

function useKhyanakhSambar(token) {
    const { data, mutate } = useSWR(!!token ? ['/khyanakhSambariinUgugdulAvya', token] : null, fetcher, { revalidateOnFocus: false })
    return { toololt: data, toololtMutate: mutate }
}

export default useKhyanakhSambar