import { useState } from "react";
import { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
const { GraphQLClient, gql } = require("graphql-request")

const client = new GraphQLClient('http://localhost:8080/graphql', { headers: {} })
// const query = gql`
//     query {getAllUser(orolt:${}){
//           khuudasniiDugaar,
//           khuudasniiKhemjee,
//           niitMur,
//           niitKhuudas,
//           jagsaalt{
//             ner,
//             ovog
//           }
//       }}
//   `
// client.request(
//     query
//     , {})


const fetcherJagsaalt = (
    query,
    token,
    baiguullagiinId,
    { search, jagsaalt, ...khuudaslalt }
) => {

    const { khuudasniiDugaar, khuudasniiKhemjee } = khuudaslalt
    const queryOrolt = gql`
    query getUser($baiguullagiinId:String!, $khuudasniiDugaar:Int!, $khuudasniiKhemjee:Int!, $search:String!){
        getAllUser(baiguullagiinId:$baiguullagiinId, khuudasniiDugaar:$khuudasniiDugaar, khuudasniiKhemjee:$khuudasniiKhemjee, search:$search){
          khuudasniiDugaar,
          khuudasniiKhemjee,
          niitMur,
          niitKhuudas,
          jagsaalt{
            ner,
            ovog
          }
      }}
  `
    return client.request(
        queryOrolt
        , { baiguullagiinId, khuudasniiDugaar, khuudasniiKhemjee, search }).catch(aldaaBarigch)
}

function useAjiltniiJagsaaltGraphQL(token, baiguullagiinId) {
    const [khuudaslalt, setAjiltniiKhuudaslaltGraphQL] = useState({
        khuudasniiDugaar: 1,
        khuudasniiKhemjee: 20,
        search: "",
        jagsaalt: [],
    });
    const { data, mutate } = useSWR(
        !!token && !!baiguullagiinId
            ? ["/ajilchdiinJagsaaltAvya", token, baiguullagiinId, khuudaslalt]
            : null,
        fetcherJagsaalt,
        { revalidateOnFocus: false }
    );
    return {
        ajilchdiinGaraltGraphQL: data,
        ajiltniiJagsaaltGraphQLMutate: mutate,
        setAjiltniiKhuudaslaltGraphQL,
    };
}

export default useAjiltniiJagsaaltGraphQL