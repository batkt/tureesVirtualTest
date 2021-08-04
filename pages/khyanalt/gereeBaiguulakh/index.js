import React, { useState } from "react"
import { Steps, Divider } from "antd"
import Admin from "../../../components/Admin"

const { Step } = Steps

function GereeBaiguulakh() {
  const [state, setState] = useState({ current: 0 })

  function onChange(current) {
    console.log("onChange:", current)
    setState({ current })
  }

  const { current } = state

  return (
    <Admin
      khuudasniiNer="gereeBaiguulakh"
      title="Гэрээ байгуулах"
      className="grid grid-cols-12 gap-6 p-5"
    >
      <Steps current={current} onChange={onChange}>
        <Step title="Step 1" description="This is a description." />
        <Step title="Step 2" description="This is a description." />
        <Step title="Step 3" description="This is a description." />
      </Steps>
    </Admin>
  )
}

export default GereeBaiguulakh
