import axios, { aldaaBarigch } from "services/uilchilgee"
import useSWR from "swr"
import moment from "moment"
import { useAuth } from "services/auth"

const fetcher = (url, token, ognoo, barilgiinId) => {
  return axios(token)
    .post(url, {
      barilgiinId,
      ekhlekhOgnoo: moment(ognoo[0])
        .startOf("month")
        .format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: moment(ognoo[1])
        .endOf("month")
        .format("YYYY-MM-DD 23:59:59"),
    })
    .then((res) => res.data)
    .catch(aldaaBarigch)
}

function useGuilgeeniiToololtAvya(token, ognoo) {
  const { barilgiinId } = useAuth()
  const { data, mutate } = useSWR(
    !!token ? ["/guilgeeniiToololtAvya", token, ognoo, barilgiinId] : null,
    fetcher,
    { revalidateOnFocus: false }
  )
  return { guilgeeniiToololt: data, guilgeeniiToololtMutate: mutate }
}
export function useTuluugiiGereeniiToololtAvya(token, ognoo) {
  const { barilgiinId } = useAuth()
  const { data, mutate } = useSWR(
    !!token
      ? ["/eneSardTuluuguiGereeniiTooAvya", token, ognoo, barilgiinId]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  )
  return { tolooguiGereeniiToo: data, tolooguiGereeniiTooMutate: mutate }
}

export default useGuilgeeniiToololtAvya
