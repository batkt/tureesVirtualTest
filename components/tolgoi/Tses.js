import Aos from "aos";
import _ from "lodash";
import Link from "next/link";
import React, { useEffect } from "react";
import { url } from "services/uilchilgee";

function MenuItem({ mur, selected, khuudasniiNer }) {
  const [open, setOpen] = React.useState(
    !!mur?.sub?.find((a) => a.khuudasniiNer === khuudasniiNer)
  );
  
  if (mur.sub) {
    return (
      <div className=''>
        <li
          className={"menu-item"}
          onClick={() => setOpen(!open)}
        >
          <div className={"flex flex-row p-1"}>
            <div className={`mr-2 ${selected ? "text-green-600" : ""}`}>
              {mur.icon}
            </div>
            {mur.ner}
            <div
              className={`transform ${open ? "rotate-180" : ""} ml-auto`}
              style={{ transitionDuration: ".1s" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-chevron-down"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </li>
        <ul className={`sub-menu duration-500 flex flex-col transition-all ${open ? "h-52" : "h-0"} `}>
          {mur.sub.map((a, index) => {
            useEffect(() => {
              Aos.init();
            },[]);
            return (
              <Link href={a.href} key={a.href}>
                <a>
                <li className={`rounded-l-lg relative cursor-pointer text-white p-2 ${
                      a.khuudasniiNer === khuudasniiNer
                        ? "bg-white dark:bg-gray-800"
                        : ""}`}>
                        <div
                        data-aos="fade-left"
                        data-aos-anchor-placement="top-bottom"                        
                        data-aos-duration="500"
                        className={"flex flex-row px-1"}>
                  <div
                  
                    className={`${
                      a.khuudasniiNer === khuudasniiNer
                        ? "text-green-500 font-medium"
                        : ""} flex flex-row`
                    }
                  >
                    <div className={`mr-2`}>
                      {a.icon}
                    </div>
                    {a.ner}
                  </div>
                  </div>
                </li>
                </a>
              </Link>
            );
          })}
        </ul>
      </div>
    );
  }
  return (
    <Link href={mur.href}>
      <a>
        <li className={selected ? "selected-menu" : "menu-item"}>
          <div className="flex flex-row p-1">
            <div className={`mr-2 ${selected ? "text-green-600" : ""}`}>
              {mur.icon}
            </div>
            {mur.ner}
          </div>
        </li>
      </a>
    </Link>
  );
}

function NTses({
  khuudasnuud,
  khuudasniiNer,
  baiguullaga,
  ajiltan,
  barilgaSoliyo,
  barilgiinId
}) {

  const barilguud = baiguullaga?.barilguud?.filter(a=> !!ajiltan?.barilguud?.find(b=>b === a._id) || ajiltan?.erkh === 'Admin')
  
  return (
    <nav className="h-full w-44 hidden md:block">
      <ul>
        <li className="px-2 mb-10">
          <div className="border-b px-2 pb-2">
            <div className="flex flex-col items-center">
              <img
                className="h-20 w-20 "
                alt={baiguullaga?.ner}
                src={
                  baiguullaga?.zurgiinNer
                    ? `${url}/logoAvya/${baiguullaga?.zurgiinNer}`
                    : "/rent.png"
                }
              />
              {barilguud?.length > 0 ? <div className="inline-block relative mt-2">
                <select defaultValue={barilgiinId} onChange={({target})=>barilgaSoliyo(target.value)} className="block appearance-none w-full bg-white dark:bg-gray-800 border border-gray-400 hover:border-gray-500 px-4 py-1 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                  {
                    barilguud?.map(a=>(
                      <option key={a?._id} className='' value={a?._id}>{a?.ner}</option>
                    ))
                  }
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div> : 
                _.get(barilguud,'0.ner')
              }
            </div>
          </div>
        </li>
        {khuudasnuud.map((mur) => (
          <MenuItem
            key={mur.href}
            mur={mur}
            selected={mur.khuudasniiNer === khuudasniiNer}
            khuudasniiNer={khuudasniiNer}
          />
        ))}
      </ul>
    </nav>
  );
}

export default NTses;
