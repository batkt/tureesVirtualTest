import React from "react"
import Admin from "components/Admin"
import { Steps, Button, message } from 'antd';
import YurunkhiiMedeelel from 'components/pageComponents/gereebaiguulakh/YurunkhiiMedeelel'
const { Step } = Steps;

const steps = [
  {
    title: 'First',
    content: YurunkhiiMedeelel,
  },
  {
    title: 'Second',
    content: 'Second-content',
  },
  {
    title: 'third',
    content: 'Last-content',
  },
  {
    title: 'fourth',
    content: 'Second-content',
  },
  {
    title: 'fifth',
    content: 'Last-content',
  },
];

function GereeBaiguulakh() {
  const [current, setCurrent] = React.useState(0);
  const [khadgalakhGeree, setKhagalakhGeree] = React.useState({});

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const currentItem = steps[current]

  return (
    <Admin
      khuudasniiNer="gereeBaiguulakh"
      title="Гэрээ байгуулах"
      className="grid grid-cols-12 gap-6 p-5"
    >
      <div className='col-span-12 p-2'>
        <Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="box p-2 my-1"><currentItem.content next={next} prev={prev} onChange={setKhagalakhGeree} value={khadgalakhGeree} /></div>
      </div>
    </Admin>
  )
}

export default GereeBaiguulakh