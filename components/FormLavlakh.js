import React, { useState, useMemo } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import { Select } from "antd";
import { useAuth } from "../services/auth";

const searchGenerator = (search, fields) => {
  if (!!search && !!fields)
    return {
      $or: fields.map((key) => ({ [key]: { $regex: search, $options: "i" } })),
    };
  else return {};
};

const fetcherJagsaalt = (
  url,
  token,
  { search, jagsaalt, ...khuudaslalt },
  query,
  fields,
  barilgiinId
) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          ...searchGenerator(search, fields),
          ...query,
          barilgiinId,
        },
      },
      ...khuudaslalt,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useLavlakh(lavlakh, token, query, fields) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setLavlakhKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    search: "",
  });
  const { data, mutate } = useSWR(
    !!token && !!barilgiinId
      ? [`/${lavlakh}`, token, khuudaslalt, query, fields, barilgiinId]
      : null,
    fetcherJagsaalt,
    { revalidateOnFocus: false }
  );
  return {
    lavlakhGaralt: data,
    lavlakhMutate: mutate,
    setLavlakhKhuudaslalt,
  };
}

function FormLavlakh({
  focuser,
  lavlakh,
  shuukhTalbaruud,
  query,
  token,
  value = "",
  onChange,
  valKey = "",
  infoKey = "",
  selectId,
  InfoComponent = () => <div></div>,
  style,
  placeholder,
}) {
  const { lavlakhGaralt, setLavlakhKhuudaslalt } = useLavlakh(
    lavlakh,
    token,
    query,
    shuukhTalbaruud
  );

  const data = useMemo(() => {
    return lavlakhGaralt?.jagsaalt?.find((a) => a[valKey] === value);
  }, [lavlakhGaralt, value, valKey]);

  return (
    <>
      <Select
        style={style}
        id={selectId}
        onKeyUp={focuser}
        showSearch
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        loading={!lavlakhGaralt}
        onSearch={(search) => setLavlakhKhuudaslalt((a) => ({ ...a, search }))}
      >
        {lavlakhGaralt?.jagsaalt?.map((a) => (
          <Select.Option key={a[valKey]} value={a[valKey]}>
            {a[infoKey]}
          </Select.Option>
        ))}
      </Select>
      <InfoComponent data={data} />
    </>
  );
}

export default FormLavlakh;
