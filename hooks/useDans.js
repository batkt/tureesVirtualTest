import { useState } from "react"
import { useAuth } from "services/auth"
import axios, { aldaaBarigch } from "services/uilchilgee"
import useSWR from "swr"

const fetcher = (
  url,
  token,
  baiguullagiinId,
  { search, jagsaalt, ...khuudaslalt },
  barilgiinId
) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          baiguullagiinId,
          barilgiinId,
        },
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch)

export function useTalbai(token, baiguullagiinId) {
  const {barilgiinId} = useAuth()
  const [khuudaslalt, setDansKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    search: "",
    jagsaalt: [],
  })
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? ["/dans", token, baiguullagiinId, khuudaslalt,barilgiinId]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  )
  return {
    setDansKhuudaslalt,
    dansGaralt: data,
    dansMutate: mutate,
  }
}

export default useTalbai
