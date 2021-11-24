import axios, { aldaaBarigch } from 'services/uilchilgee'
import useSWR from 'swr'
import moment from 'moment'

const fetcher = (url, token, ognoo) => {
    return axios(token).post(url, 
        {
            ekhlekhOgnoo:moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),   
            duusakhOgnoo:moment(ognoo[1]).format("YYYY-MM-DD 23:59:59")
        })
    .then(res => res.data).catch(aldaaBarigch)
}

function useGuilgeeniiToololtAvya(token,ognoo) {
    const { data, mutate } = useSWR(!!token ? ['/guilgeeniiToololtAvya', token,ognoo] : null, fetcher, { revalidateOnFocus: false })
    return { guilgeeniiToololt: data, guilgeeniiToololtMutate: mutate }
}

export default useGuilgeeniiToololtAvya