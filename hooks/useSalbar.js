import { useState } from "react"
import axios, { aldaaBarigch } from "services/uilchilgee"
import useSWR from "swr"

const fetcher = (url, token, baiguullagiinId, { search, ...khuudaslalt }) =>
  axios(token)
    .get(url, {
      order: { "createdAt": 1 },
      query: {
        "$and": [
          {
            "$or": [
              { ner: { "$regex": search, "$options": "i" } },
              { utas: { "$regex": search } }
            ]
          },
          { "$or": [{ tolgoinId: baiguullagiinId }, { _id: baiguullagiinId }] }
        ]
      },
      ...khuudaslalt
    })
    .then((res) => res.data)
    .catch(aldaaBarigch)

function useSalbar(token, baiguullagiinId) {
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 10,
    search: ""
  })
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? ["/baiguullaga", token, baiguullagiinId, khuudaslalt]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  )
  return { setKhuudaslalt, salbariinGaralt: data, salbarMutate: mutate }
}

export default useSalbar
