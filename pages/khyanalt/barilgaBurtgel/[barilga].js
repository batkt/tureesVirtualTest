import React from "react";
import Admin from "components/Admin";
import readMethod from "tools/function/crud/readMethod";
import { useAuth } from "services/auth";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import _ from "lodash";


function GereeBaiguulakh({ token,data }) {
  const { baiguullaga } = useAuth();
  return (
    <Admin
      khuudasniiNer="gereeBaiguulakh"
      title="Гэрээ байгуулах"
      className="grid grid-cols-12 gap-6 p-5"
      hideSearch
      dedKhuudas
    >
      <div className="col-span-12 p-5 box">
        
      </div>
    </Admin>
  );
}

const ugudulAvchirya = async (ctx,session) => {
    if(ctx.query.barilga === 'new')
        return null
    const {data} = await readMethod('barilga',session.tureestoken,ctx.query.barilga)
    return data
};

export const getServerSideProps = (ctx) => shalgaltKhiikh(ctx,ugudulAvchirya);

export default GereeBaiguulakh;
