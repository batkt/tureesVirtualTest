import { useState } from "react"
import { useAuth } from "services/auth"
import axios, { aldaaBarigch } from "services/uilchilgee"
import useSWR from "swr"

const fetcher = (
  url,
  token,
  baiguullagiinId,
  { search = "", ...khuudaslalt },
  register,
  query,
  tooAvakhEsekh,
  barilgiinId,
  order
) =>
  axios(token)
    .get(url + `${tooAvakhEsekh ? "/tooAvya" : ""}`, {
      params: {
        query: {
          register,
          barilgiinId,
          baiguullagiinId,
          $or: [
            { register: { $regex: search, $options: "i" } },
            { talbainDugaar: { $regex: search, $options: "i" } },
            { gereeniiDugaar: { $regex: search, $options: "i" } },
            { utas: { $regex: search, $options: "i" } },
            { ovog: { $regex: search, $options: "i" } },
            { ner: { $regex: search, $options: "i" } },
          ],
          ...query,
        },
        order: order,
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch)

const fetcherToololt = (url, token, barilgiinId) =>
  axios(token)
    .post(url, { barilgiinId })
    .then((res) => res.data)
    .catch(aldaaBarigch)

function useGereeniiJagsaalt(
  token,
  baiguullagiinId,
  register,
  query,
  tooAvakhEsekh,
  khuudasniiKhemjee,
  order
) {
  const { barilgiinId } = useAuth()
  const [khuudaslalt, setGereeniiKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: khuudasniiKhemjee || 100,
    search: "",
  })

  const { data, mutate } = useSWR(
    token && baiguullagiinId
      ? [
          "/geree",
          token,
          baiguullagiinId,
          khuudaslalt,
          register,
          query,
          tooAvakhEsekh,
          barilgiinId,
          order
        ]
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  )
  return {
    gereeniiMedeelel: data,
    gereeniiMedeelelMutate: mutate,
    setGereeniiKhuudaslalt,
  }
}
export function useGereeniiJagsaaltToollolt(token) {
  const { barilgiinId } = useAuth()
  const { data, mutate } = useSWR(
    token ? ["/gereeniiToololtAvya", token, barilgiinId] : null,
    fetcherToololt,
    {
      revalidateOnFocus: false,
    }
  )
  return {
    gereeToollolt: data,
    gereeToolloltMutate: mutate,
  }
}

export default useGereeniiJagsaalt
