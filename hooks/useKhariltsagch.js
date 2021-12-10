import { useState } from "react"
import { useAuth } from "services/auth"
import axios, { aldaaBarigch } from "services/uilchilgee"
import useSWR from "swr"

const fetcher = (url, token, baiguullagiinId, { search, ...khuudaslalt },barilgiinId) =>
  axios(token)
    .get(url, {
      params: {
        order: { createdAt: -1 },
        query: {
          baiguullagiinId,
          barilgiinId,
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

const fetcherToololt = (url, token,barilgiinId) =>
  axios(token)
    .get(`${url}/${barilgiinId}`)
    .then((res) => res.data)
    .catch(aldaaBarigch)

function useKhariltsagch(token, baiguullagiinId,khuudasniiKhemjee) {
  const {barilgiinId} = useAuth()
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: khuudasniiKhemjee || 10,
    search: "",
  })
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId && !!barilgiinId
      ? ["khariltsagch", token, baiguullagiinId, khuudaslalt,barilgiinId]
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
  const {barilgiinId} = useAuth()
  const { data, mutate } = useSWR(
    token ? ["/khariltsagchiinTooAvya", token,barilgiinId] : null,
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
