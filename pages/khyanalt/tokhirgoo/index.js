import shalgaltKhiikh from "../../../services/shalgaltKhiikh";
import Admin from "../../../components/Admin";
import { useAuth } from "../../../services/auth";
import { url } from "services/uilchilgee";
import KhuviinMedeelel from "./dedKheseg/KhuviinMedeelel";
import NuutsUgSolikh from "./dedKheseg/NuutsUgSolikh";
import { useMemo, useState } from "react";

const tsonkhnuud = [
  {
    tsonkh: KhuviinMedeelel
  },
  {
    tsonkh: NuutsUgSolikh
  },
]

function AjiltanBurtgel({ token }) {
  const { ajiltan = {}, ajiltanMutate } = useAuth();
  const [tsonkhniiIndex, setIndex] = useState(null)
  const songosonTsonkh = useMemo(() => {
    return (
      tsonkhnuud[tsonkhniiIndex]
    )
  }, [tsonkhniiIndex])
  return (
    <Admin title="Тохиргоо" khuudasniiNer="tokhirgoo" className='px-4 grid grid-cols-12 gap-6 pb-5'>
      <div className='col-span-12 lg:col-span-4 xxl:col-span-3 flex lg:block flex-col-reverse mt-5'>
        <div className="intro-y box mt-5 lg:mt-0">
          <div className="relative flex items-center p-5">
            <div className="w-12 h-12 image-fit">
              <img alt={ajiltan?.ner} src={ajiltan?.zurgiinNer ? `${url}/ajiltniiZuragAvya/${ajiltan?.baiguullagiinId}/${ajiltan?.zurgiinNer}` : '/profile.svg'} className="rounded-full w-12 h-12 ring-2 ring-blue-600 ring-opacity-50" />
            </div>
            <div className="ml-4 mr-auto">
              <div className="font-medium text-base">{`${ajiltan.ovog} ${ajiltan.ner}`}</div>
              <div className="text-gray-600">{ajiltan.albanTushaal}</div>
            </div>
          </div>
          <div className="p-5 border-t border-gray-200 dark:border-dark-5">
            <a onClick={() => setIndex(0)} className="flex items-center text-theme-1 dark:text-theme-10 font-medium" > <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-activity w-4 h-4 mr-2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg> Хувийн мэдээлэл </a>
            <a onClick={() => setIndex(1)} className="flex items-center mt-5" > <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-lock w-4 h-4 mr-2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Нууц үг солих </a>
            <a className="flex items-center mt-5" > <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-settings w-4 h-4 mr-2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Тохиргоо </a>
          </div>
          <div className="p-5 border-t border-gray-200 dark:border-dark-5">
            <a className="flex items-center" > <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-activity w-4 h-4 mr-2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg> Email Тохиргоо </a>
            <a className="flex items-center mt-5" > <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-lock w-4 h-4 mr-2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Social Networks </a>
            <a className="flex items-center mt-5" > <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-settings w-4 h-4 mr-2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Цалингийн мэдээ </a>
          </div>
        </div>
        {/* <div className="intro-y box p-5 bg-theme-1 text-white mt-5">
          <div className="flex items-center">
            <div className="font-medium text-lg">Important Update</div>
            <div className="text-xs bg-white text-gray-800 px-1 rounded-md ml-auto">New</div>
          </div>
          <div className="mt-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</div>
          <div className="font-medium flex mt-5">
            <button type="button" className="btn py-1 px-2 border-white text-white dark:border-gray-700 dark:text-gray-300">Take Action</button>
            <button type="button" className="btn py-1 px-2 border-transparent text-white dark:text-gray-500 ml-auto">Dismiss</button>
          </div>
        </div> */}
      </div>
      {!!ajiltan && !!songosonTsonkh && <songosonTsonkh.tsonkh ajiltan={ajiltan} token={token} ajiltanMutate={ajiltanMutate} khadgalsniiDaraa={() => setIndex(null)} />}
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default AjiltanBurtgel;
