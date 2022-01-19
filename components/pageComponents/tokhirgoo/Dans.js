import React from "react";
import {  Tooltip,Popconfirm, Button } from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
  } from "@ant-design/icons"
import deleteMethod from "tools/function/crud/deleteMethod";
import useDans from 'hooks/useDans'
import { useAuth } from "services/auth"
import { modal } from "components/ant/Modal"
import DansBurtgel from "./DansBurtgel"

function DansTile({data,dansMutate,zasya,token}) {
    function ustgaya() {
        deleteMethod('dans',token,data?._id).then(({data})=>(data === 'Amjilttai') && dansMutate())
    }

    return (<div className="box w-full">
        <div className="grid grid-cols-4 items-center p-5 justify-between w-full">
            <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">Банкны нэр</div>
                <div>{data.bank}</div>
            </div>
            <div className="">
                <div className="font-medium">Данс</div> 
                <div>{data.dugaar}</div>
            </div>
            <div className="">
                <div className="font-medium">Дансны нэр</div>
                <div>{data.dansniiNer}</div>
            </div>
            <div className="flex space-x-2 ml-auto">
                <Popconfirm
                    title={`${data.dugaar} данс устгах уу?`}
                    okText="Тийм"
                    cancelText="Үгүй"
                    onConfirm={() => ustgaya()}
                >
                    <div className="p-2 cursor-pointer bg-red-500 fill-current text-white w-8 h-8 flex items-center justify-center rounded-full" >
                        <Tooltip title='Устгах'>
                            <DeleteOutlined size={20}/>          
                        </Tooltip>          
                    </div> 
                </Popconfirm>
                <div
                className="p-2 cursor-pointer bg-yellow-500 fill-current text-white w-8 h-8 flex items-center justify-center rounded-full"
                onClick={() => zasya(data)}
                >
                    <Tooltip title='Засах'>
                        <EditOutlined />
                    </Tooltip>
                </div>
            </div>
        </div>
    </div>)
}

function Dans({
  token,
  baiguullaga
}) {
    const {barilgiinId} = useAuth()
    const ref = React.useRef(null);
    const {dansGaralt,dansMutate} = useDans(token,baiguullaga?._id)

    function dansBurtgeye(data) {
        const footer = [
            <Button onClick={() => ref.current.khaaya()}>Хаах</Button>,
            <Button type="primary" onClick={() => ref.current.khadgalya()}>
              Хадгалах
            </Button>,
          ]
          modal({
            title: "Дансны бүртгэл",
            icon: <PlusOutlined />,
            content: (
              <DansBurtgel
                ref={ref}
                data={data}
                token={token}
                barilgiinId={barilgiinId}
                baiguullagiinId={baiguullaga?._id}
                dansMutate={dansMutate}
              />
            ),
            footer,
          })
    }

  return (
    <>
      <div className='col-span-12 lg:col-span-5 xxl:col-span-4 mt-5'>
        <div className='intro-y box mt-5 lg:mt-0'>
          <div className="flex items-center pt-5 px-5 pb-2 border-b border-gray-200 dark:border-dark-5">
            <h2 className="font-medium text-base mr-auto dark:text-gray-200">
              Дансны бүртгэл
            </h2>
            <div className="p-2 cursor-pointer bg-green-500 fill-current text-white w-8 h-8 flex items-center justify-center rounded-full" onClick={() => dansBurtgeye()}>
                <Tooltip title='Нэмэх'>
                    <PlusOutlined />
                </Tooltip>
            </div>
          </div>
          {dansGaralt?.jagsaalt?.map((mur)=><DansTile className="box" key={mur._id} data={mur} zasya={dansBurtgeye} dansMutate={dansMutate} token={token}/>)}
        </div>
      </div>
      <div className='col-span-12 lg:col-span-5 xxl:col-span-4 mt-5'>
      </div>
    </>
  );
}

export default Dans;
