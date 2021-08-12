import React, { forwardRef, useImperativeHandle } from "react"
import { Divider, Form, Input, Select, TimePicker, Upload, Modal } from "antd"
import moment from "moment"
import getBase64 from "tools/function/getBase64"
import { url } from "../../../../services/uilchilgee"
const { TextArea } = Input
const { Option } = Select
const { RangePicker } = TimePicker
const { confirm } = Modal

const BarilgaBurtgekh = forwardRef(
  ({ ugugdul, readonly, tuvEsekh, destroy }, ref) => {
    const [form] = Form.useForm()

    useImperativeHandle(
      ref,
      () => ({
        khadgalya() {
          let baiguullagaUtga = baiguullagaRef.current?.burtgelAvya()
          let bairshil = bairshilRef.current?.burtgelAvya()
          if (baiguullagaUtga === false) {
            message.warning("Заавал бөглөх талбаруудыг бөглөнө үү!")
            return
          } else if (!bairshil.lat && !bairshil.lng) {
            setCurrent(1)
            message.warning("Байршил заавал оруулна уу!")
            return
          }

          let file =
            baiguullagaUtga.logo && Object.assign(baiguullagaUtga.logo, {})
          baiguullagaUtga.logo = undefined
          baiguullagaUtga._id = ugugdul?._id
          baiguullagaUtga.zasakhEsekh = ugugdul?._id ? true : false
          baiguullagaUtga.tolgoinId =
            ugugdul?._id === baiguullagiinId ? undefined : baiguullagiinId
          baiguullagaUtga.bairshil = {
            type: "Point",
            coordinates: [bairshil.lat, bairshil.lng]
          }

          let baiguullagaForm = otoFormData({
            ner: baiguullagaUtga.ner,
            baiguullaga: baiguullagaUtga
          })
          file && baiguullagaForm.append("logo", file.file)
          message.loading("Хадгалж байна")
          uilchilgee(token)
            .post("/baiguullagaBurtgekh", baiguullagaForm)
            .then(({ data }) => {
              if (data === "Amjilttai") {
                message.destroy()
                message.success("Амжилттай хадгаллаа")
                baiguullagaUtga._id === baiguullagiinId &&
                  baiguullagaMutate((b) => ({ ...b }))
                salbarMutate((s) => ({ ...s, jagsaalt: s.jagsaalt }))
                destroy()
              } else {
                message.destroy()
                message.warning("Алдаа гарлаа")
              }
            })
        },
        khaaya() {
          debugger
          if (readonly) destroy()
          else
            confirm({
              title: "Анхаар",
              okText: "Тийм",
              cancelText: "Үгүй",
              content: "Та хадгалахгүй гарахдаа итгэлтэй байна уу",
              onOk: destroy
            })
        }
      }),
      [form]
    )

    function beforeUpload(file) {
      document.getElementById("zurag").classList.add("visible")
      function after(base64) {
        let image = document.getElementById("zurag")
        let stringutga = document.getElementById("string-utga")
        image.classList.remove("hidden")
        stringutga.classList.add("hidden")
        image.src = base64
      }
      getBase64(file, after)
      return false
    }

    return (
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 24 }}
        initialValues={ugugdul}
        layout="horizontal"
        size="small"
      >
        {tuvEsekh && (
          <Form.Item
            label="Лого"
            name="logo"
            rules={[
              {
                required: ugugdul?.zurgiinNer ? false : true,
                message: "Лого заавал оруулна уу!"
              }
            ]}
          >
            <Upload
              name="logo"
              multiple={false}
              showUploadList={false}
              listType="picture-card"
              beforeUpload={beforeUpload}
            >
              <img
                id="zurag"
                className={`${ugugdul?.zurgiinNer ? "" : "hidden"} h-24 w-24`}
                alt={ugugdul?.ner}
                src={
                  ugugdul?.zurgiinNer
                    ? `${url}/logoAvya/${ugugdul?.zurgiinNer}`
                    : "/car.png"
                }
              />
              <span
                id="string-utga"
                className={`${ugugdul?.zurgiinNer ? "hidden" : ""}`}
              >
                Лого оруулах
              </span>
            </Upload>
          </Form.Item>
        )}
        <Form.Item
          label="Барилгын Нэр"
          name="ner"
          rules={[{ required: true, message: "Нэр заавал оруулна уу!" }]}
        >
          <Input disabled={readonly} />
        </Form.Item>
        <Form.Item
          label="Хаяг"
          name="khayag"
          rules={[{ required: true, message: "Хаяг заавал оруулна уу!" }]}
        >
          <TextArea disabled={readonly} />
        </Form.Item>
        <Form.Item
          label="Утас"
          name="utas"
          rules={[{ required: true, message: "Утас заавал оруулна уу!" }]}
        >
          <Input disabled={readonly} type={"tel"} />
        </Form.Item>
        <Form.Item
          label="Байршил"
          name="utas"
          rules={[{ required: true, message: "Утас заавал оруулна уу!" }]}
        >
          <Input disabled={readonly} type={"tel"} />
        </Form.Item>
      </Form>
    )
  }
)

export default BarilgaBurtgekh
