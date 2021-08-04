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
            id: baiguullagiinId,
            query: {
                baiguullagiinId,
                $or: [{ ner: { $regex: search, $options: "i" } }, { id: { $regex: search, $options: "i" } }],
            },
            ...khuudaslalt,
        })
        .then((res) => res.data)
        .catch(aldaaBarigch);

function useMailiinZagvar(token, baiguullagiinId) {
    const [khuudaslalt, setMailiinZagvarKhuudaslalt] = useState({
        khuudasniiDugaar: 1,
        khuudasniiKhemjee: 10,
        search: "",
        jagsaalt: [],
    });
    const { data, mutate } = useSWR(
        !!token && !!baiguullagiinId
            ? ["/mailiinZagvarAvya", token, baiguullagiinId, khuudaslalt]
            : null,
        fetcher,
        { revalidateOnFocus: false }
    );
    return {
        setMailiinZagvarKhuudaslalt,
        mailiinZagvar: data,
        mailiinZagvarMutate: mutate,
    };
}

export default useMailiinZagvar