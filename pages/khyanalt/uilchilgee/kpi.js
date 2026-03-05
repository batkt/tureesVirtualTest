import Admin from "components/Admin";
import React from "react";
import { useTranslation } from "react-i18next";
import { useFsmSocket } from "hooks/useFsmSocket";

function KPI() {
  const { t } = useTranslation();
  const { isConnected } = useFsmSocket();
  return (
    <Admin title="KPI гүйцэтгэл" khuudasniiNer="kpi">
      <div className="col-span-12 flex flex-col h-H8HalfRem w-[calc(100%+0.5rem)] p-4 overflow-x-hidden overflow-y-auto rounded-2xl relative bg-white dark:bg-gray-900 shadow-2xl animate-entrance">
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex items-center gap-3">
             <h1 className="text-xl font-black text-gray-800 dark:text-gray-100 tracking-tight">KPI гүйцэтгэл</h1>
             <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} title={isConnected ? 'Connected' : 'Disconnected'} />
          </div>
        </div>
        <div className="p-4 blur-sm hover:blur-none h-full flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Хөгжүүлж дуусаагүй эээээээээээ</h1>
          <p className="text-gray-400 font-extrabold">2 ayga coffee mixed with energy drink please</p>
        </div>
      </div>
    </Admin>
  );
} 

export default KPI;
