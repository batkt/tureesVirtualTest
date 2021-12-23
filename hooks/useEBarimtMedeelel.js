import { useState } from "react"
import axios, { aldaaBarigch } from "services/uilchilgee"
import useSWR from "swr"

const fetcher = (url, token, barilgiinId) => {
  return axios(token)
    .post(url, {
      barilgiinId,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch)
}

function useEBarimtMedeelel(token, barilgiinId) {
  const { data, mutate } = useSWR(
    !!token ? ["/ebarimtMedeelelAvya", token, barilgiinId] : null,
    fetcher,
    { revalidateOnFocus: false }
  )
  return {
    eBarimtMedeelel: data,
    eBarimtMedeelelMutate: mutate,
  }
}

export default useEBarimtMedeelel
