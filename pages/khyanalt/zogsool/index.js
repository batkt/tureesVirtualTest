import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React from "react";
import { useAuth } from "services/auth";
import { Table, Tabs } from "antd";
import { FileDoneOutlined } from "@ant-design/icons";

const toololt = [{name:'Нийт машины тоо',too:0},{name:'Нийт авах дүн'},{name:'Орсон дүн',too:0},	{name:'Худалдан авагчийн машины тоо',too:0},{name:'Түрээслэгчийн машины тоо',too:0},{name:'30 минутаас доош үнэгүй зогссон машин',too:0}]

function Zogsool({ token }) {
  const { baiguullaga } = useAuth();

  return (
    <Admin
      title="Төлбөр тооцоо"
      khuudasniiNer="zogsool"
      className="p-0 md:p-4"
    >
      
    {toololt.map((a,i)=>
      <div
      key={i}
      className="border-2 border-green-600 rounded-xl col-span-12 sm:col-span-12 lg:col-span-2 intro-y cursor-pointer zoom-in"
    >
      <div className="h-full rounded-xl">
        <div className="p-3 rounded-xl">
          <div className="flex">
            <div>
              <div className="text-3xl text-green-600 font-bold">
                {a.too || 0}
              </div>
              <div className="text-base text-gray-500">
                {a.name}
              </div>
            </div>
            <div className="ml-auto">
              <div className="text-green-600 text-2xl">
                {a.icon}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>)}
    <div className='col-span-12'>
      <Tabs size="large">
        <Tabs.TabPane
          key="1"
          tab={
            <span>
              <FileDoneOutlined style={{ fontSize: "32px" }} />
              Худалдан авагч
            </span>
          }
        >
          <Table 
            columns={[{title:'№',align:'center'},{title:'Хэн бэ ?',align:'center'},{title:'Машины дугаар',align:'center'},{title:'Орсон огноо',align:'center'},{title:'Гарсан огноо',align:'center'},{title:'Зарцуулсан хугацаа',align:'center'},{title:'Цагийн үнэлгээ',align:'center'},{title:'Төлөх дүн',align:'center'},{title:'Утасны дугаар',align:'center'}]}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          key="2"
          tab={
            <span>
              <FileDoneOutlined style={{ fontSize: "32px" }} />
              Түрээслэгч
            </span>
          }
        >
          <Table 
            columns={[{title:'№',align:'center'},{title:'Хэн бэ ?',align:'center',align:'center'},{title:'Машины дугаар',align:'center'},{title:'Орсон огноо',align:'center'},{title:'Гарсан огноо',align:'center'},{title:'Зарцуулсан хугацаа',align:'center'},
            {title:'Сарын зогссолын лимит цаг',align:'center'},{title:'Зогсох үлдсэн цаг',align:'center'},{title:'Илүү зогссон цаг',align:'center'},
            {title:'Энгийн цагийн үнэлгээ',align:'center'},{title:'Илүү цагийн үнэлгээ',align:'center'},{title:'Төлөх дүн',align:'center'},{title:'Утасны дугаар',align:'center'},{title:'Сануулга',align:'center'}]}
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default Zogsool;
