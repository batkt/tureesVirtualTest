import { useState } from "react"
import axios, { aldaaBarigch } from "services/uilchilgee"
import useSWR from "swr"

const fetcher = (url, token) =>
  axios(token)
    .get(url)
    .then((res) => res.data)
    .catch(aldaaBarigch)

function useEBarimtMedeelel(token) {
  const { data, mutate } = useSWR(
    !!token ? ["/ebarimtMedeelelAvya", token] : null,
    fetcher,
    { revalidateOnFocus: false }
  )
  return {
    eBarimtMedeelel: data,
    eBarimtMedeelelMutate: mutate,
  }
}

export default useEBarimtMedeelel
