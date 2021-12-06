import axios, { aldaaBarigch } from "services/uilchilgee"
import useSWR from "swr"
import moment from "moment"
import { useAuth } from "services/auth"

const fetcher = (url, token,ognoo,dansniiDugaar,barilgiinId) =>
  axios(token)
    .post(url,{barilgiinId,ekhlekhOgnoo:moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),duusakhOgnoo:moment(ognoo[1]).format('YYYY-MM-DD 23:59:59'),dansniiDugaar:dansniiDugaar?.number})
    .then((res) => res.data)
    .catch(aldaaBarigch)

function useBankniiGuilgeeToololt(token,ognoo,dansniiDugaar) {
  const {barilgiinId} = useAuth()
  const { data,  mutate } = useSWR(
    !!token ? [`/bankniiGuilgeeToololtAvya`, token,ognoo,dansniiDugaar,barilgiinId] : null,
    fetcher
  )

  return { bankniiGuilgeeToololt: data,bankniiGuilgeeToololtMutate: mutate }
}

export default useBankniiGuilgeeToololt
