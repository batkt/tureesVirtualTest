import React from "react";
import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import _ from "lodash";
import Aos from "aos";
import { useEffect } from "react";
import GereeniiZagvarJagsaalt from "components/gereeniiZagvarJagsaalt";

function index({ token }) {
  useEffect(() => {
    Aos.init({ once: true });
  }, []);
  return (
    <Admin
      khuudasniiNer="gereeniiZagvar"
      title="Гэрээний загвар"
      className="p-4"
      tsonkhniiId={"61c2c6101c2830c4e6f90c7d"}
    >
      <div className="col-span-12 flex flex-col gap-[250px]">
        <GereeniiZagvarJagsaalt token={token} zagvaraaBichijUgnu="geree" />
        <GereeniiZagvarJagsaalt token={token} zagvaraaBichijUgnu="act" />
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default index;
