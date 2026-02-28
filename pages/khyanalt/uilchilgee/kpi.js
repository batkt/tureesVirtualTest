import Admin from "components/Admin";
import React from "react";
import { useTranslation } from "react-i18next";

function KPI() {
  const { t } = useTranslation();
  return (
    <Admin title="KPI гүйцэтгэл" khuudasniiNer="kpi">
      <div className="col-span-12 flex flex-col h-H8HalfRem w-[calc(100%+0.5rem)] p-4 overflow-x-hidden overflow-y-auto rounded-2xl relative">
      <div className="p-4 blur-sm hover:blur-none">
        <h1 className="text-2xl font-bold">Хөгжүүлж дуусаагүй эээээээээээ</h1>
        <p className="text-gray-400 font-extrabold">2 ayga coffee mixed with energy drink please</p>
      </div>
      </div>
    </Admin>
  );
} 

export default KPI;
