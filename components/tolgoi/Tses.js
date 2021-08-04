import { CloseCircleOutlined } from "@ant-design/icons"
import { Badge, Modal } from "antd"
import useSonorduulga from "hooks/useSonorduulga"
import Link from "next/link"
import React from "react"
import { url } from "services/uilchilgee"
import AjiltanNemekh from "./AjiltanNemekh"

function MenuItem({ mur, selected, khuudasniiNer }) {
  const [open, setOpen] = React.useState(
    !!mur?.sub?.find((a) => a.khuudasniiNer === khuudasniiNer)
  )
  if (mur.sub) {
    return (
      <>
        <li
          className={"menu-item flex flex-row"}
          onClick={() => setOpen(!open)}
        >
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
        </li>
        <ul className="sub-menu" style={{ display: open ? "block" : "none" }}>
          {mur.sub.map((a) => {
            return (
              <Link href={a.href} key={a.href}>
                <li className={`menu-item`}>
                  <div
                    className={
                      a.khuudasniiNer === khuudasniiNer
                        ? "text-gray-100 font-medium"
                        : ""
                    }
                  >
                    {a.ner}
                  </div>
                </li>
              </Link>
            )
          })}
        </ul>
      </>
    )
  }
  return (
    <Link href={mur.href}>
      <li className={selected ? "selected-menu" : "menu-item"}>
        {mur.ner}
        <span className={selected ? "selected-menu-top" : "hidden"}>
          <span className="h-10 w-10 rounded-br-3xl bg-green-600 dark:bg-gray-900 absolute"></span>
        </span>
        <span className={selected ? "selected-menu-bottom" : "hidden"}>
          <span className="h-10 w-10 rounded-tr-3xl bg-green-600 dark:bg-gray-900 absolute"></span>
        </span>
      </li>
    </Link>
  )
}

function ProfileItem({ mur, selected, setToken, ajiltanKhasya, olonEsekh }) {
  const { sonorduulga } = useSonorduulga(mur?.token, mur?._id)

  function ajiltanGargaya(a, e) {
    e.preventDefault()
    e.stopPropagation()
    Modal.confirm({
      content: `${a?.ner} ажилтныг системээс гаргахдаа итгэлтэй байна уу?`,
      okText: "Тийм",
      cancelText: "Үгүй",
      onOk: () => ajiltanKhasya(a)
    })
  }

  return (
    <Link href={`/khyanalt/ajiltanKhyanalt/ajiltaniiZakhialguud/${mur?._id}`}>
      <li
        className={selected ? "selected-menu" : "menu-item"}
        onClick={() => setToken(mur.token)}
      >
        <div className="flex items-center">
          <div className="flex flex-row space-x-1 items-center">
            <Badge count={sonorduulga?.kharaaguiToo}>
              <img
                alt={mur?.ner}
                src={
                  mur?.zurgiinNer
                    ? `${url}/ajiltniiZuragAvya/${mur?.baiguullagiinId}/${mur?.zurgiinNer}`
                    : "/profile.svg"
                }
                className="h-14 w-14 rounded-full p-1 shadow-xl bg-gray-200"
              />
            </Badge>
            <div className=" text-sm whitespace-pre-wrap" title={mur?.ner}>
              {mur?.ner}
            </div>
          </div>
          <div
            className={`ml-auto flex items-center z-10 ${
              olonEsekh ? "" : "hidden"
            }`}
            onClick={(e) => ajiltanGargaya(mur, e)}
          >
            <CloseCircleOutlined />
          </div>
        </div>

        <span className={selected ? "selected-menu-top" : "hidden"}>
          <span className="h-10 w-10 rounded-br-3xl bg-green-600 dark:bg-gray-900 absolute"></span>
        </span>
        <span className={selected ? "selected-menu-bottom" : "hidden"}>
          <span className="h-10 w-10 rounded-tr-3xl bg-green-600 dark:bg-gray-900 absolute"></span>
        </span>
      </li>
    </Link>
  )
}

function NTses({
  khuudasnuud,
  khuudasniiNer,
  baiguullaga,
  ajiltan,
  ajiltniiJagsaalt,
  ajiltanNemya,
  setToken,
  ajiltanKhasya
}) {
  if (ajiltan?.erkh === "Zasvarchin" || ajiltan?.erkh === "Injener")
    return (
      <nav className="h-full w-44 hidden md:block">
        <ul>
          <li className="px-2 mb-5">
            <div className="border-b px-2 pb-2">
              <div className="flex flex-col items-center space-x-2">
                <img
                  className="h-10 w-10 rounded-full border-solid border-2 border-blue-500"
                  alt={baiguullaga?.ner}
                  src={
                    baiguullaga?.zurgiinNer
                      ? `${url}/logoAvya/${baiguullaga?.zurgiinNer}`
                      : "/car.png"
                  }
                />
                <div
                  className="text-gray-100 text-sm whitespace-pre-wrap mt-2"
                  title={baiguullaga?.ner}
                >
                  {baiguullaga?.ner}
                </div>
              </div>
            </div>
          </li>
          <AjiltanNemekh ajiltanNemya={ajiltanNemya} />
          {ajiltniiJagsaalt?.map((mur) => (
            <ProfileItem
              olonEsekh={ajiltniiJagsaalt.length > 1}
              key={mur.href}
              mur={mur}
              selected={mur?._id === khuudasniiNer}
              setToken={setToken}
              ajiltanKhasya={ajiltanKhasya}
            />
          ))}
        </ul>
      </nav>
    )
  return (
    <nav className="h-full w-44 hidden md:block">
      <ul>
        <li className="px-2 mb-10">
          <div className="border-b px-2 pb-2">
            <div className="flex flex-col items-center space-x-2">
              <img
                className="h-10 w-10 rounded-full border-solid border-2 border-blue-500"
                alt={baiguullaga?.ner}
                src={
                  baiguullaga?.zurgiinNer
                    ? `${url}/logoAvya/${baiguullaga?.zurgiinNer}`
                    : "/car.png"
                }
              />
              <div
                className="text-gray-100 text-sm whitespace-pre-wrap mt-2"
                title={baiguullaga?.ner}
              >
                {baiguullaga?.ner}
              </div>
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
  )
}

export default NTses
