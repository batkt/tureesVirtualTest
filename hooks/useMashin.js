import { useState } from "react"
import { useAuth } from "services/auth"
import axios, { aldaaBarigch } from "services/uilchilgee"
import useSWR from "swr"

const mashiniiTooAvya = (url,token) => axios(token).post(url).then((res) => res.data).catch(aldaaBarigch)

export function useMashinToololt(token) {
  const { data, mutate } = useSWR(!!token ? ["/mashiniiTooAvya", token]: null,mashiniiTooAvya,{ revalidateOnFocus: false })
  return {mashinToololt:data,mashinToololtMutate:mutate}
}

const fetcher = (
  url,
  token,
  baiguullagiinId,
  { search, jagsaalt, ...khuudaslalt },
  barilgiinId,
  query={}
) =>
  axios(token)
    .get(url, {
      params: {
        ...khuudaslalt,
        query:{
          barilgiinId,
          baiguullagiinId,
          $or:[ { turul: { $regex: search, $options: "i" } },
                { ezemshigchiinNer: { $regex: search, $options: "i" } },
                { ezemshigchiinRegister: { $regex: search, $options: "i" } },
                { ezemshigchiinUtas: { $regex: search, $options: "i" } }
              ],
          ...query
        },
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch)

function useMashin(token, baiguullagiinId,query) {
  const {barilgiinId} = useAuth()
  const [khuudaslalt, setMashinKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 500,
    search: "",
    jagsaalt: [],
  })
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? ["/mashin", token, baiguullagiinId, khuudaslalt,barilgiinId,query]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  return {
    setMashinKhuudaslalt,
    mashinGaralt: data,
    mashinMutate: mutate,
  }
}

export default useMashin
