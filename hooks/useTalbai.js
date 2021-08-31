import { useState } from "react"
import axios, { aldaaBarigch } from "services/uilchilgee"
import useSWR from "swr"

const fetcher = (
  url,
  token,
  baiguullagiinId,
  { search, jagsaalt, ...khuudaslalt }
) =>
  axios(token)
    .get(url, {
      query: {
        baiguullagiinId,
        $or: [
          { ner: { $regex: search, $options: "i" } },
          { id: { $regex: search, $options: "i" } },
        ],
      },
      ...khuudaslalt,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch)

export function useTalbai(token, baiguullagiinId) {
  const [khuudaslalt, setTalbaiKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 10,
    search: "",
    jagsaalt: [],
  })
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? ["/talbai", token, baiguullagiinId, khuudaslalt]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  )
  return {
    setTalbaiKhuudaslalt,
    talbainiiGaralt: data,
    talbainiiJagsaaltMutate: mutate,
  }
}

export default useTalbai
