import { useState } from "react"
import { useAuth } from "services/auth"
import axios, { aldaaBarigch } from "services/uilchilgee"
import useSWR from "swr"

const fetcher = (url, token, baiguullagiinId, { search, turul,...khuudaslalt },barilgiinId) =>
  axios(token)
    .get(url, {
      params: {
        order: { createdAt: -1 },
        query: {
          baiguullagiinId,
          barilgiinId,
          turul,
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

function useMailiinZagvar(token,turul) {
  const {barilgiinId,baiguullaga} = useAuth()
  const [khuudaslalt, setMailiinZagvarKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 10,
    search: "",
    turul
  })
  const { data, mutate } = useSWR(
    !!token && !!baiguullaga?._id
      ? ["mailiinZagvar", token, baiguullaga?._id, khuudaslalt,barilgiinId]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  )
  return {
    setMailiinZagvarKhuudaslalt,
    mailiinZagvarGaralt: data,
    mailiinZagvarMutate: mutate,
  }
}

export default useMailiinZagvar
