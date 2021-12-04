import { useState } from "react"
import axios, { aldaaBarigch } from "services/uilchilgee"
import useSWR from "swr"
import moment from "moment"
import { useAuth } from "services/auth"

const fetcher = (
  url,
  token,
  { search, jagsaalt, ...khuudaslalt },
  query,
  baiguullagiinId,
  barilgiinId
) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          baiguullagiinId,
          barilgiinId,
          ...query,
        },
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch)

function useEBarimt(token, baiguullagiinId, query) {
  const {barilgiinId} = useAuth()
  const [khuudaslalt, setEBarimtKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    search: "",
    jagsaalt: [],
  })
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? ["/ebarimtJagsaaltAvya", token, khuudaslalt, query, baiguullagiinId,barilgiinId]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  )
  return {
    setEBarimtKhuudaslalt,
    eBarimtGaralt: data,
    eBarimtMutate: mutate,
  }
}

export default useEBarimt
