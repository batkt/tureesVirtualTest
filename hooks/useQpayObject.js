import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = async (url, token, invoice_id) =>
  await uilchilgee(token)
    .get(url, {
      params: {
        invoice_id: invoice_id,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useQpayObject(token, invoice_id) {
  const { data, mutate } = useSWR(
    !!token && !!invoice_id ? ["/qpayObjectAvya", token, invoice_id] : null,
    fetcher,
    { revalidateOnFocus: true }
  );

  return {
    qpayObject: data,
    qpayObjectMutate: mutate,
  };
}

export default useQpayObject;
