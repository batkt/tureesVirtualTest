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

export default useUilchluulegch;
