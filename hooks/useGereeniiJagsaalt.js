import { useState } from "react"
import axios, { aldaaBarigch } from "services/uilchilgee"
import useSWR from "swr"

const fetcher = (url) =>
  axios()
    .get(url)
    .then((res) => res.data)
    .catch(aldaaBarigch)

function useGereeniiJagsaalt() {
  const { data, mutate } = useSWR("/api/geree", fetcher, {
    revalidateOnFocus: false
  })
  return { gereeniiMedeelel: data }
}

export default useGereeniiJagsaalt
