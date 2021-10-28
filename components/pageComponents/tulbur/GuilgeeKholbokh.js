import { notification, Select } from "antd";
import _ from "lodash";
import React from "react";
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt";
import formatNumber from "../../../tools/function/formatNumber";
import getListMethod from "../../../tools/function/crud/getListMethod";
import uilchilgee from "../../../services/uilchilgee";
import moment from 'moment'

function GuilgeeKholbokh({data, token, baiguullagiinId, onFinish, destroy }, ref) {
  const [geree, setGeree] = React.useState(null);
  const [magadlaltaiGereenuud, setMagadlaltaiGereenuud] = React.useState([]);
  
  const { gereeniiMedeelel, setGereeniiKhuudaslalt } = useGereeniiJagsaalt(
    token,
    baiguullagiinId
  );

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        _.isFunction(onFinish) && onFinish();
        destroy();
      },
      khadgalya() {
        if(!geree)
        {
          notification.warning({message:'Та гэрээгээ сонгоно уу'})
          return
        }
        uilchilgee(token).post('/tulultKhadgalya',{
          turul:'bank',
          tulsunDun:data.amount,
          ognoo:moment(data.tranDate).set('hour',data.time.substring(0, 2)).set('minute',data.time.substring(2, 4)),
          guilgeeniiId:data._id,
          gereeniiId:geree,
          dansniiDugaar:data.dansniiDugaar,
          tulsunDans:data.relatedAccount
        }).then(({data})=>{
          notification.success({placement:'bottomRight',message:'Амжилттай'})
          _.isFunction(onFinish) && onFinish();
          destroy();
        })
       
      },
    }),
    [geree]
  );

    React.useEffect(()=>{
      getListMethod('geree',token,{query:{_id:data?.magadlaltaiGereenuud}})
      .then(({data})=>{
        setMagadlaltaiGereenuud(data?.jagsaalt)
      })
    },[])

  return (
    <div className="flex flex-col space-y-4">
      {magadlaltaiGereenuud?.length > 0 &&
        <div>
          <label>Санал болгох гэрээ сонгох</label>
          {magadlaltaiGereenuud.map((a,i)=>
            <div className={`border-l border-r border-b p-2 grid grid-cols-12 gap-1 zoom-in ${i === 0 ? 'border-t' : ''} ${a?._id === geree ? 'bg-green-100' : ''}`} key={a?._id} onClick={()=>setGeree(a?._id)}>
              <div className='col-span-3 font-medium'>{a?.gereeniiDugaar}</div>
              <div className='col-span-3'>{a?.ner}</div>
              <div className='col-span-2 font-medium'>{a?.utas}</div>
              <div className='col-span-2'>{a?.talbainDugaar}</div>
              <div className='col-span-2'>{formatNumber(a?.uldegdel)}₮</div>
            </div>
          )}
        </div>
      }
      <label className="text-lg font-medium">Гүйлгээнд талбай холбох</label>
      <Select
        placeholder="Талбай"
        onSearch={(search) => setGereeniiKhuudaslalt((a) => ({ ...a, search }))}
        onChange={setGeree}
        filterOption={o=>o}
        showSearch
      >
        {gereeniiMedeelel?.jagsaalt?.map((mur) => {
          return (
            <Select.Option key={mur._id} value={mur._id}>
              <div className='flex flex-row justify-between'>
                <div className='flex flex-row space-x-2'>
                  <label>Талбай:</label>
                  <div>{mur.talbainDugaar}</div>
                </div>
                <div className='flex flex-row'>
                  <div>{formatNumber(mur.uldegdel)}₮</div>
                </div>
              </div>
            </Select.Option>
          );
        })}
      </Select>
    </div>
  );
}

export default React.forwardRef(GuilgeeKholbokh);
