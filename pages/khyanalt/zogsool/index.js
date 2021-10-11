import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React from "react";
import { useAuth } from "services/auth";

function Zogsool({ token }) {
  const { baiguullaga } = useAuth();

  return (
    <Admin
      title="Төлбөр тооцоо"
      khuudasniiNer="zogsool"
      className="p-0 md:p-4"
    ></Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default Zogsool;
