import React, { useImperativeHandle,useState } from "react"
import { Button, Input, message } from "antd"
import createMethod from "tools/function/crud/createMethod"
import updateMethod from "tools/function/crud/updateMethod"

function ZardalBurtgekh({ data, barilgiinId, token, destroy, onRefresh }, ref) {

    const [zardal,setZardal] = useState({})

    useImperativeHandle(
      ref,
      () => ({
        khadgalya() {
          const data = form.getFieldsValue()
          data.barilgiinId = barilgiinId
          const method = data?._id ? updateMethod : createMethod
          method("mashin", token, data).then(({ data }) => {
            if (data === "Amjilttai") {
              message.success("Амжилттай хадгаллаа")
              onRefresh && onRefresh()
              destroy()
            }
          })
        },
        khaaya() {
          destroy()
        },
      }),
      [zardal]
    )
  
    return (
        <div className={`space-y-2`}>
            <Input placeholder="Нэр"/>
            <Button>Дэд зардал бүртгэх</Button>
        </div>
    )
}

export default React.forwardRef(ZardalBurtgekh)