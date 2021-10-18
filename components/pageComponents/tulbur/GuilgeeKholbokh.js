import { notification, Select } from "antd";
import _ from "lodash";
import React from "react";
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt";
import formatNumber from "../../../tools/function/formatNumber";
import uilchilgee from "../../../services/uilchilgee";
import moment from 'moment'

function GuilgeeKholbokh({data, token, baiguullagiinId, onFinish, destroy }, ref) {
  const [geree, setGeree] = React.useState(null);
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

  return (
    <div className="flex flex-col space-y-2">
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
