import axios, { aldaaBarigch } from 'services/uilchilgee'
import useSWR from 'swr'

const fetcher = (url, token, ekhlekhOgnoo,duusakhOgnoo) => {
    return axios(token).post(url, {ekhlekhOgnoo,duusakhOgnoo}).then(res => res.data).catch(aldaaBarigch)
}

function useGuilgeeniiToololtAvya(token,ekhlekhOgnoo,duusakhOgnoo) {
    const { data, mutate } = useSWR(!!token ? ['/guilgeeniiToololtAvya', token,ekhlekhOgnoo,duusakhOgnoo] : null, fetcher, { revalidateOnFocus: false })
    return { guilgeeniiToololt: data, guilgeeniiToololtMutate: mutate }
}

export default useGuilgeeniiToololtAvya