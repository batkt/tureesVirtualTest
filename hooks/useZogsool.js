import { useState } from "react"
import { useAuth } from "services/auth"
import axios, { aldaaBarigch } from "services/uilchilgee"
import useSWR from "swr"

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
          ...query
        },
        order:{check_in_time:-1}
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch)

function useZogsool(token, baiguullagiinId,query) {
  const {barilgiinId} = useAuth()
  const [khuudaslalt, setZogsoolKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    search: "",
    jagsaalt: [],
  })
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? ["/zogsool", token, baiguullagiinId, khuudaslalt,barilgiinId,query]
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
