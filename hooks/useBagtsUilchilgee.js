import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (
    url,
    token,
    baiguullagiinId,
    { search, jagsaalt, ...khuudaslalt }
) =>
    axios(token)
        .post(url, {
            query: {
                baiguullagiinId,
                $or: [{ ner: { $regex: search, $options: "i" } }],
            },
            ...khuudaslalt,
        })
        .then((res) => res.data)
        .catch(aldaaBarigch);

function useBagtsUilchilgee(token, baiguullagiinId) {
    const [khuudaslalt, setBagtsUilchilgeeniiKhuudaslalt] = useState({
        khuudasniiDugaar: 1,
        khuudasniiKhemjee: 10,
        search: "",
        jagsaalt: [],
    });
    const { data, mutate } = useSWR(
        !!token && !!baiguullagiinId
            ? ["/bagtsiinUilchilgeeniiJagsaaltAvya", token, baiguullagiinId, khuudaslalt]
            : null,
        fetcher,
        { revalidateOnFocus: false }
    );
    return {
        setBagtsUilchilgeeniiKhuudaslalt,
        bagtsUilchilgeeniiGaralt: data,
        bagtsUilchilgeeMutate: mutate,
    };
}

export default useBagtsUilchilgee