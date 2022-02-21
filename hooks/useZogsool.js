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
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch)

function useZogsool(token, baiguullagiinId) {
  const {barilgiinId} = useAuth()
  const [khuudaslalt, setZogsoolKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    search: "",
    jagsaalt: [],
  })
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? ["/zogsool", token, baiguullagiinId, khuudaslalt,barilgiinId]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  )
  return {
    setZogsoolKhuudaslalt,
    zogsoolGaralt: data,
    zogsoolMutate: mutate,
  }
}

export default useZogsool
