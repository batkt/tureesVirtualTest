import React, { useState } from "react";
import Admin from "components/Admin";
import readMethod from "tools/function/crud/readMethod";
import { useAuth } from "services/auth";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import LocationPicker from "components/ant/LocationPicker";
import _ from "lodash";
import {Button, Form, Input, InputNumber} from "antd";
import axios from "axios";

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

function GereeBaiguulakh({ token,data }) {
  const { baiguullaga } = useAuth();
  const [davkhar,setDavkhar] = useState(0)
  const [bdavkhar,setBDavkhar] = useState(0)
  const [form] = Form.useForm();

  const onChange =(v)=>{
    if(!!v?.davkhar)
      setDavkhar(v?.davkhar)
    if(!!v?.bdavkhar)
      setBDavkhar(v?.bdavkhar)
    if(!!v?.register && v?.register?.length === 7)
      axios.get(`http://103.50.205.33:8080/tatvaraasBaiguullagaAvya/${v?.register}`,{headers:{ "Content-type": "application/json","Authorization":`bearer ${token}`}}).then(({data})=>{
        if(data?.found === true)
          form.setFieldsValue({ner:data?.name})}
        )
  }

  function khadgalya() {
    console.log(form.getFieldsValue())
  }

  return (
    <Admin
      khuudasniiNer="gereeBaiguulakh"
      title="Гэрээ байгуулах"
      className="grid grid-cols-12 gap-6 p-5"
      hideSearch
      dedKhuudas
    >
      <div className="col-span-3 p-5 box">
        <div className='mb-5 text-lg font-medium'>
          <label>Барилга бүртгэл</label>
        </div>
        <Form
          form={form}
          name="barilga"
          {...formItemLayout}
          onValuesChange={onChange}
        >
          <Form.Item name="ner" label="Нэр">
            <Input/>
          </Form.Item>
          <Form.Item name="register" label="Регистр" rules={[
            {
              required: true,
              len: 7,
              pattern: new RegExp("(\\d{7})"),
              message: "Регистр бүртгэнэ үү!",
            },
          ]}>
            <Input/>
          </Form.Item>
          <Form.Item name="davkhar" label="Давхар">
            <InputNumber style={{width:'100%'}}/>
          </Form.Item>
          <Form.Item name="bdavkhar" label="B Давхар">
            <InputNumber style={{width:'100%'}}/>
          </Form.Item>
          <Form.Item name="khayag" label="Хаяг">
            <Input.TextArea/>
          </Form.Item>
          <Form.Item name="bairshil" label="Байршил">
            <LocationPicker/>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              span: 14,
              offset: 10,
            }}
          >
            <Button type="primary" htmlType="submit"  onClick={()=>khadgalya()}>
              Хадгалах
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="col-span-9 p-5 box">
          <div className=''>
            {davkhar && new Array(davkhar).fill('').map((a,i)=>{
              if((davkhar - i) === 1)
              return (
                <div className='flex flex-row space-x-8'>
                  <div key={`row${i}`} className={`w-32 h-10 flex flex-row justify-around items-end border-l-4 border-r-4 border-black zoom-in border-t-4 ${bdavkhar === 0 ? 'border-b-4' : ''}`}>
                    <div className='w-5 h-8 bg-gray-100 border-4 border-b-0 border-black'></div>
                  </div>
                  <div className='flex flex-row items-center'>
                    <div className='w-20'>{davkhar - i} давхар</div>
                    <div><InputNumber placeholder='m2 Үнэ'   formatter={(value) =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} parser={(value) => value.replace(/\$\s?|(,*)/g, "")}/></div>
                  </div>
                </div>
              )
              return (
                <div className='flex flex-row space-x-8'>
                <div key={`row${i}`} className={`w-32 h-10 flex flex-row justify-around items-center border-l-4 border-r-4 border-black zoom-in border-t-4`}>
                  <div className='w-5 h-5 bg-gray-100 border-4 border-black'></div>
                  <div className='w-5 h-5 bg-gray-100 border-4 border-black'></div>
                  <div className='w-5 h-5 bg-gray-100 border-4 border-black'></div>
                </div>
                <div className='flex flex-row items-center'>
                    <div className='w-20'>{davkhar - i} давхар</div>
                    <div><InputNumber placeholder='m2 Үнэ'   formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}/></div>
                  </div>
                </div>
              )
            })}
            {bdavkhar && new Array(bdavkhar).fill('').map((a,i)=>{
              return (
                <div className='flex flex-row space-x-8'>
                <div key={`row${i}`} className={`w-32 h-10 flex flex-row justify-center items-center zoom-in border-l-4 border-r-4 border-black border-t-4 ${bdavkhar === (1 + i) ? 'border-b-4' : ''}`}>
                </div>
                <div className='flex flex-row items-center'>
                    <div className='w-20'>B-{i+1} давхар</div>
                    <div>
                      <InputNumber placeholder='m2 Үнэ'   formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}/>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
      </div>
    </Admin>
  );
}

const ugudulAvchirya = async (ctx,session) => {
    if(ctx.query.barilga === 'new')
        return null
    const {data} = await readMethod('barilga',session.tureestoken,ctx.query.barilga)
    return data
};

export const getServerSideProps = (ctx) => shalgaltKhiikh(ctx,ugudulAvchirya);

export default GereeBaiguulakh;
