import React from "react";
import {  Input, Tooltip,Popconfirm } from "antd";
import {
    DeleteOutlined,
    SaveOutlined,
  } from "@ant-design/icons"
import updateMethod from "tools/function/crud/updateMethod";
import createMethod from "tools/function/crud/createMethod";
import deleteMethod from "tools/function/crud/deleteMethod";
import useDans from 'hooks/useDans'
import { useAuth } from "services/auth"

function DansBurtgel({data,token,dansMutate,baiguullagiinId}) {
    const [ugugdul,setUgugdul] = React.useState(data)
    const {barilgiinId} = useAuth()
    function khadgalya() {
        const method = ugugdul?._id ? updateMethod : createMethod
        ugugdul['barilgiinId'] = barilgiinId
        ugugdul['baiguullagiinId'] = baiguullagiinId

        method('dans',token,ugugdul).then(({data})=>{
            if(data === 'Amjilttai')
                {
                    setUgugdul(a=>{
                        a['dugaar'] = ''
                        a['dansniiNer'] = ''
                        a['bank'] = ''
                        return a
                    })
                    dansMutate()
                }
        })
    }

    function ustgaya() {
        deleteMethod('dans',token,data?._id).then(({data})=>(data === 'Amjilttai') && dansMutate())
    }

    return (
        <div className="box">
            <div className="flex items-center p-5 space-x-2">
                <div className="border-l-2 border-green-500 pl-4">
                    <div className="font-medium">Данс</div> 
                    <Input defaultValue={ugugdul.dugaar} onChange={({target})=>setUgugdul(a=>({...a,dugaar:target.value}))}/>
                </div>
                <div className="">
                    <div className="font-medium">Дансны нэр</div>
                    <Input defaultValue={ugugdul.dansniiNer} onChange={({target})=>setUgugdul(a=>({...a,dansniiNer:target.value}))}/>
                </div>
                <div className="">
                    <div className="font-medium">Банкны нэр</div>
                    <div className="flex flex-row" >
                        <Input defaultValue={ugugdul.bank} onChange={({target})=>setUgugdul(a=>({...a,bank:target.value}))}/>
                        {JSON.stringify(data) !== JSON.stringify(ugugdul) ? <div className="ml-2 text-green-500 font-medium" onClick={khadgalya}>
                            <Tooltip title='Хадгалах'>
                                <SaveOutlined size={20}/>          
                            </Tooltip>          
                        </div> 
                        :
                        <Popconfirm
                            title="Данс= устгах уу?"
                            okText="Тийм"
                            cancelText="Үгүй"
                            onConfirm={() => ustgaya()}
                        >
                            <div className="ml-2 text-red-500 font-medium" >
                                <Tooltip title='Устгах'>
                                    <DeleteOutlined size={20}/>          
                                </Tooltip>          
                            </div> 
                        </Popconfirm>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}


function Dans({
  token,
  baiguullaga
}) {
  const {dansGaralt,dansMutate} = useDans(token,baiguullaga?._id)

  return (
    <>
      <div className='col-span-12 lg:col-span-5 xxl:col-span-4 mt-5'>
        <div className='intro-y box mt-5 lg:mt-0'>
          <div className="flex items-center pt-5 px-5 pb-2 border-b border-gray-200 dark:border-dark-5">
            <h2 className="font-medium text-base mr-auto dark:text-gray-200">
              Дансны бүртгэл
            </h2>
          </div>
          {dansGaralt?.jagsaalt?.map((mur)=><DansBurtgel className="box" key={mur._id} data={mur} dansMutate={dansMutate} token={token} baiguullagiinId={baiguullaga?._id}/>)}
          <DansBurtgel data={{dugaar:'',dansniiNer:'',bank:''}} dansMutate={dansMutate} token={token} baiguullagiinId={baiguullaga?._id}/>
        </div>
      </div>
      <div className='col-span-12 lg:col-span-5 xxl:col-span-4 mt-5'>
      </div>
    </>
  );
}

export default Dans;
