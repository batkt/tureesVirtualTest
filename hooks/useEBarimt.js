import { useState } from "react"
import axios, { aldaaBarigch } from "services/uilchilgee"
import useSWR from "swr"
import moment from "moment"

const fetcher = (
  url,
  token,
  { search, jagsaalt, ...khuudaslalt },
  query,
  baiguullagiinId
) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          baiguullagiinId,
          ...query,
        },
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch)

function useEBarimt(token, baiguullagiinId, query) {
  const [khuudaslalt, setEBarimtKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    search: "",
    jagsaalt: [],
  })
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? ["/ebarimtJagsaaltAvya", token, khuudaslalt, query, baiguullagiinId]
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
