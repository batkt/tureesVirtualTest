import { useState } from "react"
import axios, { aldaaBarigch } from "services/uilchilgee"
import { useAuth } from "services/auth"
import useSWR from "swr"
import moment from "moment"

const fetcher = (
  url,
  token,
  ognoo,
  { search, jagsaalt, ...khuudaslalt },
  davkhar,
  barilgiinId
) =>
  axios(token)
    .post(url, {
      barilgiinId,
      ekhlekhOgnoo: moment(ognoo)
        .startOf("month")
        .format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: moment(ognoo).endOf("month").format("YYYY-MM-DD 23:59:59"),
      query: {
        query: {
          davkhar,
          $or: [
            { register: { $regex: search, $options: "i" } },
            { talbainDugaar: { $regex: search, $options: "i" } },
            { gereeniiDugaar: { $regex: search, $options: "i" } },
            { utas: { $regex: search, $options: "i" } },
          ],
        },
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch)

function useNekhemjlekh(token, ognoo, davkhar) {
  const { barilgiinId } = useAuth()
  const [khuudaslalt, setNekhemjlelKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 1000,
    search: "",
    jagsaalt: [],
  })
  const { data, mutate } = useSWR(
    !!token
      ? ["/eneSardTulukhJagsaaltAvya", token, ognoo, khuudaslalt,davkhar,barilgiinId]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  )
  return {
    setNekhemjlelKhuudaslalt,
    nekhemjlel: data,
    nekhemjlelMutate: mutate,
  }
}

export default useNekhemjlekh
