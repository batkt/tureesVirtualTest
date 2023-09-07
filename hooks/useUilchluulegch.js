import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import moment from "moment";

const fetcher = (
    url,
    token,
    baiguullagiinId,
    { search, jagsaalt, ...khuudaslalt },
    barilgiinId,
    query = {},
    order
) => {
    return axios(token)
        .get(url, {
            params: {
                ...khuudaslalt,
                query: {
                    baiguullagiinId,
                    barilgiinId,
                    $or: [
                        { mashiniiDugaar: { $regex: search, $options: "i" } },
                    ],
                    ...query,
                },
                order,
            },
        })
        .then((res) => res.data)
        .catch(aldaaBarigch);
};

function useUilchluulegch(token, baiguullagiinId, query, order) {
    const { barilgiinId } = useAuth();
    const [khuudaslalt, setUilchluulegchKhuudaslalt] = useState({
        khuudasniiDugaar: 1,
        khuudasniiKhemjee: 100,
        search: "",
        jagsaalt: [],
    });
    const { data, mutate, isValidating } = useSWR(
        !!token && !!baiguullagiinId
            ? [
                "/zogsoolUilchluulegch",
                token,
                baiguullagiinId,
                khuudaslalt,
                barilgiinId,
                query,
                order,
            ]
            : null,
        fetcher,
        { revalidateOnFocus: false }
    );
    return {
        setUilchluulegchKhuudaslalt,
        uilchluulegchGaralt: data,
        uilchluulegchMutate: mutate,
        isValidating,
    };
}
const fetcherToololt = (url, token, barilgiinId, query) =>{
  if(!!barilgiinId)
      return axios(token)
          .post(url, { barilgiinId, ...query })
          .then((res) => res.data)
          .catch(aldaaBarigch);
};

export function useUilchluulegchToololt(token, query) {
    const { barilgiinId } = useAuth();
    const { data, mutate } = useSWR(
        !!token ? ["/zogsoolUilchluulegchdiinToo", token, barilgiinId, query] : null,
        fetcherToololt,
        { revalidateOnFocus: false }
    );
    // console.log("---------", data);
    return { uilchiluulegchToololt: data, uilchiluulegchToololtMutate: mutate };
}
export function useUilchluulegchZogsoolToo(token, query) {
    const { barilgiinId } = useAuth();
    const { data, mutate } = useSWR(
        !!token ? ["/zogsoolTusBurUilchluulegchdiinToo", token, barilgiinId, query] : null,
        fetcherToololt,
        { revalidateOnFocus: false }
    );
    console.log("---------", data);
    return { zogsoolTusBuriinToo: data, zogsoolTusBuriinTooMutate: mutate };
}

export default useUilchluulegch;
