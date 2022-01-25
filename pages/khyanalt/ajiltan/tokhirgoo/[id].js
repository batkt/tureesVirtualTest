import { Button, message, Select, Switch, Tooltip, Transfer } from "antd"
import Admin from "components/Admin"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import shalgaltKhiikh from "services/shalgaltKhiikh"
import uilchilgee from "services/uilchilgee"
import readMethod from "tools/function/crud/readMethod"
import {
  tsonknuud,
  khereglegchiinErkhuud,
} from "tools/logic/khereglegchiinErkhiinTokhirgoo"
import { useAuth } from "services/auth"
import useAjiltan from "hooks/useAjiltan"

function index({ token, data }) {
  const router = useRouter()
  const [targetKeys, setTargetKeys] = useState(data?.tsonkhniiErkhuud || [])
  const { ajiltan, ajiltanMutate } = useAjiltan(token)
  const [selectedKeys, setSelectedKeys] = useState([])
  const [tokhirgoo, setTokhirgoo] = useState([])
  const [khiikhTokhirgoo, setkhiikhTokhirgoo] = useState([])
  const { baiguullaga, barilgiinId } = useAuth()
  const [ajiltanMedeelel, setAjiltanMedeelel] = useState()
  const barilguud = baiguullaga?.barilguud
  const handleChange = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys)
    setkhiikhTokhirgoo(
      tsonknuud.filter(
        (a) => !a.nuuya && !!nextTargetKeys.find((b) => b === a.key)
      )
    )
  }

  const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys])
  }
  
  const khadgalya = () => {
    uilchilgee(token)
      .post(`/ajiltandErkhUgyu/${data?._id}`, { tsonkhniiErkhuud: targetKeys,barilguud:ajiltanMedeelel })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          message.success("Бүртгэл амжилттай хийгдлээ")
          router.back()
        }
      })
  }

  const erkhSoliyo = (erkh) => {
    const khereglegchiinErkh = khereglegchiinErkhuud.find(
      (a) => a.erkh === erkh
    )
    setTargetKeys([...khereglegchiinErkh.tsonkhnuud])
  }
  useEffect(() => {
    setAjiltanMedeelel(ajiltan?.barilguud)
  }, [ajiltan])
  

  return (
    <Admin title={"Ажилтны эрхийн тохиргоо"} dedKhuudas className="p-5">
      <div className="box col-span-12 p-2 flex flex-row items-center">
        <div className="font-medium space-y-2">
          <div className="flex flex-row space-x-2">
            <div>{data?.ner}</div>
            <div>{data?.ovog}</div>
          </div>
          <div className="flex flex-row space-x-2">
            <div>{data?.albanTushaal}</div>
          </div>
        </div>
        <div className="mx-3">
          <Select onChange={erkhSoliyo} placeholder="Хэрэглэгчийн эрх">
            {khereglegchiinErkhuud.map((a) => (
              <Select.Option key={a.erkh} value={a.erkh}>
                {a.tailbar}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="flex flex-row space-x-3 ml-4">
          <div>Барилга тохируулах</div>
          <Select
            mode="multiple"            
            onChange={(v) => setAjiltanMedeelel(v)}
            placeholder="Барилга тохируулах"
            style={{ width: "80%" }}
            value={ajiltanMedeelel}
          >
            {barilguud?.map((a) => (
              <Select.Option key={a._id} value={a._id}>
                {a.ner}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="ml-auto mr-2">
          <Button type="primary" onClick={khadgalya}>
            Хадгалах
          </Button>
        </div>
      </div>
      <div className="box col-span-6 p-2">
        <div className="flex items-center pt-5 px-5 pb-2 border-b border-gray-200 dark:border-dark-5">
          <h2 className="font-medium text-base mr-auto dark:text-gray-200">
            Цонхны эрх
          </h2>
        </div>
        <Transfer
          locale={{
            itemsUnit: "Боломжит эрх",
            remove: "Буцаах",
            selectAll: "Бүгдийг сонгох",
            selectInvert: "Эсэргээр нь сонгох",
            removeAll: "Бүгдийг буцаах",
          }}
          listStyle={{ height: "100%", width: "45%", marginTop: 10 }}
          dataSource={tsonknuud.filter((a) => !a.nuuya)}
          titles={["Цонхнууд", "Цонхны эрх"]}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={handleChange}
          onSelectChange={handleSelectChange}
          render={(item) => (
            <Tooltip title={item.tailbar}>
              <div>{item.ner}</div>
            </Tooltip>
          )}
          oneWay
        />
      </div>
      <div className="box col-span-6 p-2">
        <div className="flex items-center pt-5 px-5 pb-2 border-b border-gray-200 dark:border-dark-5">
          <h2 className="font-medium text-base mr-auto dark:text-gray-200">
            Цонхны эрхийн тохиргоо
          </h2>
        </div>
        {khiikhTokhirgoo
          .map((a) => [...a.tokhirgoo])
          .flat()
          .map((mur) => (
            <div className="box" key={mur.ner}>
              <div className="flex items-center p-5">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">{mur.ner}</div>
                  <div className="text-gray-600">{mur.tailbar}</div>
                </div>
                <div className="ml-auto">
                  <Switch
                    checked={!!tokhirgoo?.find((a) => mur.ner === a)}
                    onChange={(checked) => {
                      setTokhirgoo((a) => {
                        if (!checked) {
                          const index = a.findIndex((b) => b === mur.ner)
                          a.splice(index, 1)
                        } else a.push(mur.ner)
                        return [...a]
                      })
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </Admin>
  )
}

const ugudulAvchirya = async (ctx, session) => {
  const { data } = await readMethod(
    "ajiltan",
    session.tureestoken,
    ctx.query.id
  )
  return data
}

export const getServerSideProps = (ctx) => shalgaltKhiikh(ctx, ugudulAvchirya)

export default index
