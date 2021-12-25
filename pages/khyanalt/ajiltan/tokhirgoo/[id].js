import Admin from "components/Admin";
import React from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import readMethod from "tools/function/crud/readMethod";

function index({ token, data }) {
  return (
    <Admin title={"Ажилтны эрхийн тохиргоо"} dedKhuudas>
      <div></div>
    </Admin>
  );
}

const ugudulAvchirya = async (ctx, session) => {
  const { data } = await readMethod(
    "ajiltan",
    session.tureestoken,
    ctx.query.id
  );
  return data;
};

export const getServerSideProps = (ctx) => shalgaltKhiikh(ctx, ugudulAvchirya);

export default index;
