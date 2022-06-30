import React, { useState } from 'react'
import moment from 'moment'
import {
  FileExcelOutlined,
  FileImageOutlined,
  RightOutlined,  
  UserOutlined,
} from "@ant-design/icons";
import { Button, Upload } from 'antd';
import ZagvarBurtgel from '../medegdel/ZagvarBurtgel';
import { modal } from 'components/ant/Modal';
import { useAuth } from 'services/auth';
import AjiltanNemekh from './ajiltanNemekh';
import { url } from 'services/uilchilgee';

const ognoonuud = new Array(30).fill('').map((v,i)=>moment().add(i,'d').format('YYYY-MM-DD'))

function DaalgavarNemekh({className},ref, token, onRefresh) { 
  const ajitanRef = React.useRef(null);
  const { ajiltan, barilgiinId } = useAuth();   
  const [duusakhOgnoo, setDuusakhOgnoo] = useState();
  const [daalgavar, setDaalgavar] = React.useState({});
  function ajiltanSongokh(){
    const footer = [
      <Button onClick={() => ajitanRef.current.khaaya()}>Хаах</Button>,
      <Button
        style={{ backgroundColor: "#209669", color: "#ffffff" }}
        onClick={() => ajitanRef.current.khadgalya()}
      >
        сонгох
      </Button>,
    ];
    modal({
      title: "Ажилтан сонгох",
      icon: <FileExcelOutlined />,
      content: (
       <AjiltanNemekh
       ref={ajitanRef}
       token={token}
       onFinish={onRefresh}
       barilgiinId={barilgiinId}
       />
      ),
      footer,
      
    });
  }





    return (
        <div
        ref={ref}
        data-aos="flip-right"
        data-aos-delay="200"
        data-aos-anchor-placement="top-bottom"
        className={`col-span-12 space-y-10 p-8 xl:px-12 2xl:px-28 relative bg-white dark:bg-gray-900 xl:col-span-7 ${className}`}
      >
        <div className="text-center text-xl font-medium">Даалгавар бүртгэх</div>
        <div className="flex overflow-x-scroll justify-between gap-2 lg:justify-center xl:justify-between">
          {ognoonuud.map(ognoo=> <div key={ognoo} onClick={()=>setDuusakhOgnoo(ognoo)} 
          className={`w-16 rounded-2xl cursor-pointer ${ognoo===duusakhOgnoo? "bg-green-400 text-white" : ""} hover:bg-green-400 transition-colors hover:text-white duration-500 bg-gray-200 py-2 text-center font-bold`}>
            <div className="text-xl">{moment(ognoo).format("DD")}</div>
            <div className='w-16'>{moment(ognoo).format("MM")} сар</div>
          </div>)}
        </div>
        <div className="text-2xl font-medium">Ажилтан сонгоно уу</div>
        <div className="flex flex-col gap-5">
          <div onClick={ajiltanSongokh} className="flex justify-between hover:bg-green-400 hover:text-white cursor-pointer duration-500 transition-colors rounded-xl bg-gray-200 p-5 xl:w-2/3">
            <div className="flex gap-5">
              <UserOutlined className="text-xl" />
              <div>
                <div className="text-lg font-medium">Ажилтан</div>
                <div>Та ажилтангаа сонгоно уу</div>
              </div>
            </div>
            <div>
              <RightOutlined className="items-end self-center" />
            </div>
          </div>
          <Upload
          multiple={true}
          name="file"
          listType="picture"
          action={`${url}/zuragKhadgalya`}
          method="POST"
          data={{ turul: "daalgavriinZurag" }} 
          headers={{ Authorization: `bearer ${token}` }}
          className="flex flex-col"                   
        >
          <div className="flex justify-between rounded-xl hover:bg-green-500 cursor-pointer hover:text-white duration-500 transition-colors bg-gray-200 p-5 xl:w-2/3">
            <div className="flex gap-5">
              <FileImageOutlined className="text-xl" />
              <div>
                <div className="text-lg font-medium">Зураг</div>
                <div>Та зураг сонгоно уу</div>
              </div>
            </div>
            <div>
              <RightOutlined className="items-end self-center" />
            </div>
          </div>
          </Upload>         
        </div>
        <div>
          <input
            className="h-24 mt-10 w-full border-2 p-5"
            placeholder="Даалгавар"
            type={"text"}
          ></input>
        </div>
        <div className="flex w-full justify-center">
          <button className="rounded-xl bg-green-500 py-1 px-24 text-lg font-medium text-white">
            Хадгалах
          </button>
        </div>
      </div>
    )
}

export default React.forwardRef(DaalgavarNemekh)
