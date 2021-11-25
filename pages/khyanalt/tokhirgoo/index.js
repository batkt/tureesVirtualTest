import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import { useAuth } from "services/auth";
import { url } from "services/uilchilgee";
import KhuviinMedeelel from "components/pageComponents/tokhirgoo/KhuviinMedeelel";
import NuutsUgSolikh from "components/pageComponents/tokhirgoo/NuutsUgSolikh";
import UndsenMedeelel from "components/pageComponents/tokhirgoo/UndsenMedeelel";

import GereeniiTokhirgoo from "components/pageComponents/tokhirgoo/GereeniiTokhirgoo";
import KhungulultiinTokhirgoo from "components/pageComponents/tokhirgoo/KhungulultiinTokhirgoo";
import TalbainTokhirgoo from "components/pageComponents/tokhirgoo/TalbainTokhirgoo";
import AshiglaltiinZardal from "components/pageComponents/tokhirgoo/AshiglaltiinZardal";
import Medegdel from "components/pageComponents/tokhirgoo/Medegdel";

import { useMemo, useState } from "react";

function AjiltanBurtgel({ token }) {
  const { ajiltan, ajiltanMutate,baiguullaga,baiguullagaMutate } = useAuth();
  const [tsonkh, setTsonkh] = useState(null)

  const tokhirgoo = useMemo(()=>{

    if(ajiltan?.erkh === 'Admin')
    return [
        {
          icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-settings w-4 h-4 mr-2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
          text:'Үндсэн тохиргоо',
          tsonkh:<UndsenMedeelel {...{ajiltan, ajiltanMutate,baiguullaga,baiguullagaMutate}} token={token}/>
        },
        {
          icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-settings w-4 h-4 mr-2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
          text:'Хөнгөлөлт',
          tsonkh:<KhungulultiinTokhirgoo {...{ajiltan, ajiltanMutate,baiguullaga,baiguullagaMutate}} token={token}/>
        },
        {
          icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-settings w-4 h-4 mr-2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
          text:'Гэрээний удирдлага',
          tsonkh:<GereeniiTokhirgoo {...{ajiltan, ajiltanMutate,baiguullaga,baiguullagaMutate}} token={token}/>
        },
        {
          icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-settings w-4 h-4 mr-2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
          text:'Талбайн удирдлага',
          tsonkh:<TalbainTokhirgoo {...{ajiltan, ajiltanMutate,baiguullaga,baiguullagaMutate}} token={token}/>
        },
        {
          icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-settings w-4 h-4 mr-2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
          text:'Ашиглалтын зардал',
          tsonkh:<AshiglaltiinZardal {...{ajiltan, ajiltanMutate,baiguullaga,baiguullagaMutate}} token={token}/>
        },
        {
          icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-settings w-4 h-4 mr-2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> ,
          text:'Мэдэгдэл',
          tsonkh:<Medegdel {...{ajiltan, ajiltanMutate,baiguullaga,baiguullagaMutate}} token={token}/>
        }
    ]
    else return [
      {
        icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-activity w-4 h-4 mr-2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
        text:'Хувийн мэдээлэл',
        tsonkh: <KhuviinMedeelel/>
      },
      {
        icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-lock w-4 h-4 mr-2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
        text:'Нууц үг солих',
        tsonkh: <NuutsUgSolikh/>
      }
    ]
  },[ajiltan,baiguullaga])

  return (
    <Admin title="Тохиргоо" khuudasniiNer="tokhirgoo" className='px-4 grid grid-cols-12 gap-6 pb-5'>
      <div className='col-span-12 lg:col-span-2 xxl:col-span-3 flex lg:block flex-col-reverse mt-5'>
        <div className="intro-y box mt-5 lg:mt-0">
          <div className="relative flex items-center p-5">
            <div className="w-12 h-12 image-fit">
              <img alt={ajiltan?.ner} src={ajiltan?.zurgiinNer ? `${url}/ajiltniiZuragAvya/${ajiltan?.baiguullagiinId}/${ajiltan?.zurgiinNer}` : '/profile.svg'} className="rounded-full w-12 h-12 ring-2 ring-green-600 ring-opacity-50" />
            </div>
            <div className="ml-4 mr-auto">
              <div className="font-medium text-base">{`${ajiltan?.ovog} ${ajiltan?.ner}`}</div>
              <div className="text-gray-600">{ajiltan?.albanTushaal}</div>
            </div>
          </div>
          <div className="p-5 border-t border-gray-200 dark:border-dark-5 text-green-600">
            {tokhirgoo?.map(mur=><div className={`flex items-center mt-5 cursor-pointer ${mur?.text === tsonkh?.text ? 'font-medium' : ''} `} onClick={()=>setTsonkh(mur)}>{mur.icon}  {mur.text}</div>)}
          </div>
        </div>
      </div>
      {tsonkh?.tsonkh}        
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default AjiltanBurtgel;
