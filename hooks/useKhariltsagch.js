import { useState } from "react"
import axios, { aldaaBarigch } from "services/uilchilgee"
import useSWR from "swr"

const fetcher = (url, token, baiguullagiinId, { search, ...khuudaslalt }) =>
  axios(token)
    .get(url, {
      params: {
        order: { createdAt: -1 },
        query: {
          baiguullagiinId,
          $or: [
            { ner: { $regex: search, $options: "i" } },
            { register: { $regex: search, $options: "i" } },
            { utas: { $regex: search, $options: "i" } },
          ],
        },
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch)

const fetcherToololt = (url, token) =>
  axios(token)
    .get(url)
    .then((res) => res.data)
    .catch(aldaaBarigch)
function useKhariltsagch(token, baiguullagiinId) {
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 10,
    search: "",
  })
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? ["khariltsagch", token, baiguullagiinId, khuudaslalt]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  )
  return {
    setKhuudaslalt,
    khariltsagchiinGaralt: data,
    khariltsagchMutate: mutate,
  }
}
export function useKhariltsagchToololt(token) {
  const { data, mutate } = useSWR(
    token ? ["/khariltsagchiinTooAvya", token] : null,
    fetcherToololt,
    {
      revalidateOnFocus: false,
    }
  )
  return {
    khariltsagchToololt: data,
    khariltsagchToololtMutate: mutate,
  }
}

export default useKhariltsagch
