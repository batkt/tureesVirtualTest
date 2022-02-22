import axios, { aldaaBarigch } from "services/uilchilgee"
import useSWR from "swr"
import moment from "moment"
import { useAuth } from "services/auth"
import { useState } from "react"

const fetcher = (url, token, ognoo, barilgiinId,{search,...khuudaslalt}) => {
  return axios(token)
    .post(url, {
        barilgiinId,
        ekhlekhOgnoo: moment(ognoo[0])
            .startOf("month")
            .format("YYYY-MM-DD 00:00:00"),
        duusakhOgnoo: moment(ognoo[1])
            .endOf("month")
            .format("YYYY-MM-DD 23:59:59"),
        query:{
            ...khuudaslalt,
            query:{
                barilgiinId,
                $or:[
                    { register: { $regex: search, $options: "i" } },
                    { talbainDugaar: { $regex: search, $options: "i" } },
                    { gereeniiDugaar: { $regex: search, $options: "i" } },
                    { utas: { $regex: search, $options: "i" } },
                    { ovog: { $regex: search, $options: "i" } },
                    { ner: { $regex: search, $options: "i" } },
                ]
            }
        }
    })
    .then((res) => res.data)
    .catch(aldaaBarigch)
}

function useEneSardTuluuguiGereenuudAvya(token, ognoo) {
    const { barilgiinId } = useAuth()
    
    const [khuudaslalt, setEneSardTuluuguiGereenuud] = useState({
        khuudasniiDugaar: 1,
        khuudasniiKhemjee: 100,
        search: "",
    })

    const { data, mutate } = useSWR(
        !!token && !!barilgiinId ? ["/eneSardTuluuguiGereenuudAvya", token, ognoo, barilgiinId,khuudaslalt] : null,
        fetcher,
        { revalidateOnFocus: false }
    )
    return { eneSardTuluuguiGereenuud: data, eneSardTuluuguiGereenuudMutate: mutate, setEneSardTuluuguiGereenuud }
}

export default useEneSardTuluuguiGereenuudAvya
