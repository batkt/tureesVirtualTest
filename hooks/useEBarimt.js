import { useState } from "react"
import axios, { aldaaBarigch } from "services/uilchilgee"
import useSWR from "swr"
import moment from "moment"

const fetcher = (
  url,
  token,
  { search, jagsaalt, ...khuudaslalt },
  ognoo,
  baiguullagiinId
) =>
  axios(token)
    .get(url, {
      query: {
        baiguullagiinId,
        createdAt: {
          $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
          $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
        },
        tuluv: { $exists: false },
      },
      ...khuudaslalt,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch)

function useEBarimt(token, baiguullagiinId, ognoo) {
  debugger
  const [khuudaslalt, setEBarimtKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    search: "",
    jagsaalt: [],
  })
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? ["/ebarimtJagsaaltAvya", token, khuudaslalt, ognoo, baiguullagiinId]
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
