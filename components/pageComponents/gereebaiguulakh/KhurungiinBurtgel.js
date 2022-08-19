import { Form, Button, Input, InputNumber, Select, Divider, notification, Popconfirm } from "antd";
import { ArrowRightOutlined, ArrowLeftOutlined, CloseOutlined } from "@ant-design/icons";
import React, { useEffect, useMemo } from "react";
import { toWords } from "mon_num";
import uilchilgee from "services/uilchilgee";
import _ from "lodash";
import Aos from "aos";
import useTalbai from "hooks/useTalbai";
import { useAuth } from "services/auth";
import formatNumber from "tools/function/formatNumber";

var timeout = null;

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

function TalbaiSongolt({value,onChange,mode}) {
  const {token,baiguullaga} = useAuth()

  const {talbainiiGaralt,setTalbaiKhuudaslalt} = useTalbai(token,baiguullaga?._id)

  function onValueChange(v) {
    onChange(talbainiiGaralt.jagsaalt.find(a=>a._id === v))
  }

  return (
    <Select placeholder='Талбай' filterOption={false} value={value} mode={mode} showSearch onChange={onValueChange} loading={!talbainiiGaralt} onSearch={(search) => setTalbaiKhuudaslalt((a) => ({ ...a, search }))}>
      {talbainiiGaralt?.jagsaalt?.map(a=>{
        return <Select.Option key={a._id}>{a.kod}</Select.Option>
      })}
    </Select>
  )
}

const YurunkhiiMedeele = ({
  token,
  baiguullaga,
  next,
  prev,
  onChange,
  value,
  barilgiinId,
}) => {
  const [form] = Form.useForm();

  const sulEsekh = (talbainDugaar, callback) => {
    uilchilgee(token)
      .get("/talbainSulEskhiigShalgay", {
        params: {
          talbainDugaar: talbainDugaar,
          barilgiinId: barilgiinId,
        },
      })
      .then(({ data }) => {
        if (data === "OK" || data === value.gereeniiDugaar) {
          callback(data);
        } else
          notification.warning({
            message: (
              <div>
                <b>{talbainDugaar}</b> талбай нь <b>{data}</b> гэрээн дээр
                холбогдсон байна.
              </div>
            ),
          });
      });
  };

  function talbainBurtgelBugulyu(talbainuud) {
    console.log('talbainuud',talbainuud)
    value.baritsaaAvakhDun = talbainuud.reduce((a,b)=>a+Number(b.talbainNiitUne || 0),0)
    value.sariinTurees = talbainuud.reduce((a,b)=>a+Number(b.tureesiinTulbur || 0),0)
    value.talbainNegjUne = talbainuud.reduce((a,b)=>a+b.talbainNegjUne,0)
    value.talbainNiitUne = value.baritsaaAvakhDun
    value.talbainKhemjee = talbainuud.reduce((a,b)=>a+b.talbainKhemjee,0)
    value.zardliinDun = talbainuud.reduce((a,b)=>a+Number(b.niitAshiglaltiinZardal || 0),0)
    value.talbainNegjUneUsgeer = toWords(value.talbainNegjUne);
    value.talbainNiitUneUsgeer = toWords(value.talbainNiitUne);
    value.davkhar = [...new Set(talbainuud.map((a)=>a.davkhar))].join(",")
    value.talbainDugaar = talbainuud.map((a)=>a.kod).join(",");
    form.setFieldsValue(value);
  }

  function onChangeTalbai(v) {
    if(!!value.talbainuud?.find(a=>a.kod === v.kod)){
      notification.warning({
        message: (
          <div>
            <b>{v.kod}</b> талбай нь гэрээн дээр
            сонгогдсон байна.
          </div>
        ),
      });
      return
    }
    sulEsekh(v.kod,()=>{
      value.talbainuud = value.talbainuud || []
      value.talbainuud.push(v)
      talbainBurtgelBugulyu(value.talbainuud)
      onChange({...value})
    })
  }

  function talbaiUstgaya(index) {
    value.talbainuud.splice(index,1)
    talbainBurtgelBugulyu(value.talbainuud)
    onChange({...value})
  }

  useEffect(() => {
    Aos.init({ once: true });
  });

  return (
    <Form
      form={form}
      name="validate_other"
      {...formItemLayout}
      initialValues={value}
      onValuesChange={(values) => onChange({ ...value, ...values })}
    >
      <div data-aos="fade-right" data-aos-duration="1000">
        <Form.Item label="Талбайн дугаар" >
          <TalbaiSongolt value={''} onChange={onChangeTalbai}/>
        </Form.Item>
      </div>
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="100" className="space-y-2 pb-4">
          {value.talbainuud?.map((talbai,index)=>{
            return (
              <div key={talbai?._id} className='p-2 rounded-md bg-gray-50 shadow-md space-y-2 border border-gray-400 group relative'>
                <div className="font-medium text-xl">
                  Код:{talbai.kod}
                </div>
                <div className="divide-y-2 border">
                  <div className="grid grid-cols-12 divide-x-2">
                    <div className="col-span-2 text-center">Давхар</div>
                    <div className="col-span-2 text-center">m<sup>2</sup></div>
                    <div className="col-span-4 text-center">Зардал</div>
                    <div className="col-span-4 text-center">Нийт төлбөр</div>
                  </div>
                  <div className="grid grid-cols-12 divide-x-2">
                    <div className="col-span-2 text-center">{talbai.davkhar}</div>
                    <div className="col-span-2 text-center">{talbai.talbainKhemjee}</div>
                    <div className="col-span-4 text-right pr-2">{formatNumber(talbai.niitAshiglaltiinZardal)}</div>
                    <div className="col-span-4 text-right pr-2">{formatNumber(talbai.talbainNiitUne)}</div>
                  </div>
                </div>
                <div className="flex flex-row justify-end">
                  <div>Түрээсийн төлбөр:</div>
                  <div className="text-right w-32 font-medium text-base">{formatNumber(talbai.tureesiinTulbur)}</div>
                </div>
                <div className="absolute -top-2 right-0 h-full bg-gray-300 rounded-r-md hidden group-hover:flex items-center justify-center p-2 text-lg">
                  <Popconfirm
                      title={`${talbai.kod} талбай устгах уу?`}
                      okText="Тийм"
                      cancelText="Үгүй"
                      onConfirm={() => talbaiUstgaya(index)}
                  >
                    <div className="cursor-pointer p-2 rounded-full bg-gray-100 text-red-500 bg-opacity-80" >
                      <CloseOutlined/>
                    </div>
                  </Popconfirm>
                </div>
              </div>
            )
          })}
      </div>
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="200" className="py-5">
          <div className="divide-y-2 border">
            <div className="grid grid-cols-12 divide-x-2">
              <div className="col-span-2 text-center">Давхар</div>
              <div className="col-span-2 text-center">m<sup>2</sup></div>
              <div className="col-span-4 text-center">Зардал</div>
              <div className="col-span-4 text-center">Нийт төлбөр</div>
            </div>
            <div className="grid grid-cols-12 divide-x-2">
              <div className="col-span-2 text-center font-medium text-base">{value.davkhar}</div>
              <div className="col-span-2 text-center font-medium text-base">{value.talbainKhemjee}</div>
              <div className="col-span-4 text-right pr-2 font-medium text-base">{formatNumber(value.zardliinDun)}</div>
              <div className="col-span-4 text-right pr-2 font-medium text-base">{formatNumber(value.sariinTurees)}</div>
            </div>
          </div>
      </div>
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="600">
        <Form.Item label="Зориулалт" name="zoriulalt">
          <Input placeholder="Зориулалт" />
        </Form.Item>
      </div>
      <Form.Item wrapperCol={{ span: 24 }}>
        <div
          className="flex w-full flex-row justify-between"
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="700"
        >
          <Button onClick={prev} icon={<ArrowLeftOutlined />} className="mr-4">
            Гэрээний хугацаа
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<ArrowRightOutlined />}
            onClick={() => next()}
          >
            Барьцаа бүртгэл
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default YurunkhiiMedeele;
