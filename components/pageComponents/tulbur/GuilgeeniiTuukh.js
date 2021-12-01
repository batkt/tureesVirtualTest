import { Button, Input, message, Popconfirm } from "antd"
import React, { useImperativeHandle, useState } from "react"
import axios, { aldaaBarigch } from "services/uilchilgee"
import useSWR from "swr"
import moment from "moment"
import formatNumber from "tools/function/formatNumber"
import { BankOutlined, DeleteOutlined } from "@ant-design/icons"
import { modal } from "components/ant/Modal"
import { useReactToPrint } from "react-to-print"
import Tulbur from "../eBarimt/Tulbur"

const fetcher = (url, token, gereeniiId, ognoo) =>
  axios(token)
    .get(`${url}/${gereeniiId}`, {
      params: { duusakhOgnoo: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59") },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch)

const Tailbar = React.forwardRef(({ destroy, confirm }, ref) => {
  const [tailbar, setTailbar] = useState("")
  React.useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        confirm(tailbar)
        destroy()
      },
      khaaya() {
        destroy()
      },
    }),
    [tailbar]
  )
  return (
    <div>
      <Input.TextArea
        value={tailbar}
        onChange={({ target }) => setTailbar(target?.value)}
      />
    </div>
  )
})

const turulAvya = (turul) => {
  
  if(turul === "avlaga")
    return 'Авлага'
  else if(turul === "voucher")
    return 'Купон'
  else if(turul === "bank")
    return 'Банк'
  else if(turul === "khyamdral")
    return 'Хямдрал'
}

function useGuilgee(token, gereeniiId, ognoo) {
  const { data, mutate } = useSWR(
    !!token ? ["/gereeniiTulultAvya", token, gereeniiId, ognoo] : null,
    fetcher,
    { revalidateOnFocus: false }
  )
  return {
    guilgeeniiTuukh: data,
    guilgeeniiTuukhMutate: mutate,
  }
}

function GuilgeeniiTuukh({ token, data, refreshData, ognoo }, ref) {
  const { guilgeeniiTuukh, guilgeeniiTuukhMutate } = useGuilgee(
    token,
    data?._id,
    ognoo
  )
  const tailbarRef = React.useRef(null)
  const printRef = React.useRef(null)

  function tulultUstgaya({
    guilgeeniiId,
    tulsunDun,
    tulukhDun,
    _id,
    turul,
    khyamdral,
  }) {
    const footer = [
      <Button onClick={() => tailbarRef.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => tailbarRef.current.khadgalya()}>
        Устгах
      </Button>,
    ]
    modal({
      title: "Төлөлт устгах шалтгаан",
      icon: <DeleteOutlined />,
      content: (
        <Tailbar
          ref={tailbarRef}
          confirm={(tailbar) =>
            axios(token)
              .post("/tulultUstgaya", {
                turul,
                guilgeeniiId,
                gereeniiId: data?._id,
                tulsunDun,
                tulukhDun,
                khyamdral,
                objectiinId: _id,
                tailbar,
              })
              .then(({ data }) => {
                if (data) {
                  message.success("Төлөлт амжилттай устгагдлаа!")
                  refreshData()
                }
              })
          }
        />
      ),
      footer,
    })
  }

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  })

  useImperativeHandle(
    ref,
    () => ({
      khevlekh() {
        handlePrint()
      },
      refreshData() {
        guilgeeniiTuukhMutate()
      },
    }),
    [printRef]
  )
  function ebarimtUgukh(data) {
    modal({
      title: (
        <div className="w-full flex flex-row justify-between">
          <div>Түрээсийн төлбөрийн и-баримт</div>
          <div className="mr-5">{data.mashiniiDugaar}</div>{" "}
        </div>
      ),
      content: (
        <Tulbur
          data={data}
          token={token}
          // ajiltan={ajiltan}
          // baiguullaga={baiguullaga}
          //zakhialgaMutate={zakhialgaMutate}
        />
      ),
      footer: false,
    })
  }

  return (
    <div className="ml-12">
      <div ref={printRef}>
        <div className="print mb-2">
          <div>Гүйлгээний түүх</div>
          <div className="ml-auto">Талбайн дугаар:{data?.talbainDugaar}</div>
        </div>
        <div className="p-1 grid grid-cols-9 text-gray-700 dark:text-gray-400 bg-gray-200 dark:bg-gray-800  border-b border-gray-200">
          <div>№</div>
          <div>Огноо</div>
          <div>Түрээс</div>
          <div>Төлөх дүн</div>
          <div>Хямдрал</div>
          <div>Төлсөн дүн</div>
          <div>Ажилтан</div>
          <div>Хэлбэр</div>
          <div>Тайлбар</div>
        </div>
        {guilgeeniiTuukh?.map((a, i) => (
          <div className="grid grid-cols-9 text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 hover:bg-green-100">
            <div className="p-1">{i + 1}</div>
            <div className="p-1">{moment(a.ognoo).format("YYYY-MM-DD")}</div>
            <div className="p-1">{formatNumber(a.undsenDun, 0)}</div>
            <div className="p-1">{formatNumber(a.tulukhDun, 0)}</div>
            <div className="p-1">{formatNumber(a.khyamdral, 0)}</div>
            <div className="p-1">{formatNumber(a.tulsunDun, 0)}</div>
            <div className="p-1">{a.guilgeeKhiisenAjiltniiNer}</div>
            <div className="p-1">
              {a.turul === "bank" ? a.tulsunDans : turulAvya(a.turul)}
            </div>
            <div className="flex justify-between p-1">
              {a.tailbar}
              {(a.turul === "avlaga" ||
                a.turul === "voucher" ||
                a.turul === "bank" ||
                a.turul === "khyamdral") && (
                <div className="contents justify-between">
                  <Popconfirm
                    title="Төлөлт устгах уу?"
                    okText="Тийм"
                    cancelText="Үгүй"
                    onConfirm={() => tulultUstgaya(a)}
                  >
                    <div className="ml-auto flex items-center justify-center rounded-full p-1 border text-red-500 w-6 h-6 cursor-pointer hide-on-print">
                      <DeleteOutlined />
                    </div>
                  </Popconfirm>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default React.forwardRef(GuilgeeniiTuukh)
