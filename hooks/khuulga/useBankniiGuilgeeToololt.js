import axios, { aldaaBarigch } from "services/uilchilgee"
import useSWR from "swr"
import moment from "moment"

const fetcher = (url, token,ognoo,dansniiDugaar) =>
  axios(token)
    .post(url,{ekhlekhOgnoo:moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),duusakhOgnoo:moment(ognoo[1]).format('YYYY-MM-DD 23:59:59'),dansniiDugaar:dansniiDugaar?.number})
    .then((res) => res.data)
    .catch(aldaaBarigch)

function useBankniiGuilgeeToololt(token,ognoo,dansniiDugaar) {
  const { data,  mutate } = useSWR(
    !!token ? [`/bankniiGuilgeeToololtAvya`, token,ognoo,dansniiDugaar] : null,
    fetcher
  )

  return { bankniiGuilgeeToololt: data,bankniiGuilgeeToololtMutate: mutate }
}

export default useBankniiGuilgeeToololt
