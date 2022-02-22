import React, { useEffect, useState } from "react"
import Admin from "components/Admin"
import { useAuth } from "services/auth"
import shalgaltKhiikh from "services/shalgaltKhiikh"
import LocationPicker from "components/ant/LocationPicker"
import _ from "lodash"
import { Button, Form, Input, InputNumber, notification, Table } from "antd"
import axios from "axios"
import updateMethod from "tools/function/crud/updateMethod"
import { useRouter } from "next/router"
import BarilgaTile from "components/pageComponents/barilga/BarilgaTile"
import CardList from "components/cardList"
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}

function GereeBaiguulakh({ token, data }) {
  const { baiguullaga } = useAuth()
  const router = useRouter()
  const { barilga } = router.query
  const [davkhar, setDavkhar] = useState(
    _.get(baiguullaga, `barilguud.${barilga}.davkharuud`)?.filter(
      (a) => !a.davkhar.includes("B")
    ) || []
  )
  const [bdavkhar, setBDavkhar] = useState(
    _.get(baiguullaga, `barilguud.${barilga}.davkharuud`)?.filter(
      (a) => !!a.davkhar.includes("B")
    ) || []
  )

  const [form] = Form.useForm()

  const onChange = (v) => {
    if (!!v?.davkhar) {
      const davkhar = new Array(v?.davkhar)
        .fill("")
        .map((a, i) => ({
          davkhar: i + 1,
          tariff: 0,
        }))
        .reverse()
      setDavkhar([...davkhar])
    }
    if (!!v?.bdavkhar) {
      const bdavkhar = new Array(v?.bdavkhar).fill("").map((a, i) => ({
        davkhar: `B${i + 1}`,
        tariff: 0,
      }))
      setBDavkhar([...bdavkhar])
    }
    if (!!v?.register && v?.register?.length === 7)
      axios
        .get(
          `http://103.50.205.33:8080/tatvaraasBaiguullagaAvya/${v?.register}`,
          {
            headers: {
              "Content-type": "application/json",
              Authorization: `bearer ${token}`,
            },
          }
        )
        .then(({ data }) => {
          if (data?.found === true) form.setFieldsValue({ ner: data?.name })
        })
  }

  function khadgalya() {
    const burtgekhBarilga = form.getFieldsValue()
    burtgekhBarilga.davkharuud = [...davkhar, ...bdavkhar]
    if (!baiguullaga?.barilguud) baiguullaga.barilguud = []

    if (barilga === "new") baiguullaga?.barilguud.push(burtgekhBarilga)
    else {
      const { _id } = _.get(baiguullaga, `barilguud.${barilga}`)
      _.set(burtgekhBarilga, `_id`, _id)
      _.set(baiguullaga, `barilguud.${barilga}`, burtgekhBarilga)
    }

    updateMethod("baiguullaga", token, baiguullaga).then(({ data }) => {
      if (data === "Amjilttai") {
        notification.success({ message: "Амжилттай хадгаллаа" })
        router.back()
      } else notification.warning({ message: "Алдаа гарлаа" })
    })
  }

  function m2Uurchilyu(v, mur) {
    if (_.isString(mur?.davkhar) && mur?.davkhar?.includes("B")) {
      const index = bdavkhar.findIndex((a) => a.davkhar === mur?.davkhar)
      bdavkhar[index].tariff = v
      setBDavkhar(bdavkhar)
    } else {
      const index = davkhar.findIndex((a) => a.davkhar === mur?.davkhar)
      davkhar[index].tariff = v
      setDavkhar(davkhar)
    }
  }

  return (
    <Admin
      khuudasniiNer="gereeBaiguulakh"
      title="Гэрээ байгуулах"
      className="grid grid-cols-12 gap-6 p-5"
      hideSearch
      dedKhuudas
    >
      <div className="box col-span-12 p-5 md:col-span-6 xl:col-span-4">
        <div className="mb-5 text-lg font-medium">
          <label>Барилга бүртгэл</label>
        </div>
        <Form
          form={form}
          name="barilga"
          {...formItemLayout}
          onValuesChange={onChange}
          initialValues={{
            ..._.get(baiguullaga, `barilguud.${barilga}`),
            davkhar: davkhar?.length,
            bdavkhar: bdavkhar?.length,
          }}
        >
          <Form.Item name="ner" label="Нэр">
            <Input />
          </Form.Item>
          <Form.Item name="register" label="Регистр">
            <Input />
          </Form.Item>
          <Form.Item name="davkhar" label="Давхар">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="bdavkhar" label="B Давхар">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="khayag" label="Хаяг">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="bairshil" label="Байршил">
            <LocationPicker />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              span: 16,
              offset: 8,
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => khadgalya()}
            >
              Хадгалах
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="box col-span-12 hidden p-5 md:col-span-6 md:block xl:col-span-8">
        <Table
          size="small"
          pagination={{ pageSize: 100 }}
          columns={[
            { title: "Давхар", dataIndex: "davkhar" },
            {
              title: "m2 Үнэ",
              dataIndex: "tariff",
              render(utga, mur, index) {
                return (
                  <InputNumber
                    placeholder="m2 Үнэ"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    defaultValue={utga}
                    onChange={(v) => m2Uurchilyu(v, mur)}
                  />
                )
              },
            },
            { title: "План зураг" },
          ]}
          dataSource={[...davkhar, ...bdavkhar]}
        />
      </div>
    </Admin>
  )
}

export const getServerSideProps = (ctx) => shalgaltKhiikh(ctx)

export default GereeBaiguulakh
