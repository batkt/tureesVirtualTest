import React, { useEffect } from "react";
import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import _ from "lodash";
import Aos from "aos";

function AnketBurgekh() {
  useEffect(() => {
    Aos.init({ once: true });
  });

  return (
    <Admin
      khuudasniiNer="anketNemekh"
      title="Анкет нэмэх"
      className="grid grid-cols-12 gap-6 p-5"
      hideSearch
      dedKhuudas
    >
      <div className="box col-span-12 p-5 md:col-span-6 xl:col-span-8">
        <div className="mb-5 text-lg font-medium">
          <label>Анкет </label>
        </div>
      </div>
      <div className="box col-span-12 p-5 md:col-span-6 xl:col-span-4">
        <div className="mb-5 text-lg font-medium">
          <label>Анкет загвар</label>
        </div>
      </div>
    </Admin>
  );
}

export const getServerSideProps = (ctx) => shalgaltKhiikh(ctx);

export default AnketBurgekh;
