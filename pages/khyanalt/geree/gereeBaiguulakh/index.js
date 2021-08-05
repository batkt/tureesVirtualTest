import React from "react"
import Admin from "components/Admin"
import uilchilgee from "services/uilchilgee"
import { Steps } from 'antd';
import YurunkhiiMedeelel from 'components/pageComponents/gereebaiguulakh/YurunkhiiMedeelel'
import Baritsaa from 'components/pageComponents/gereebaiguulakh/Baritsaa'
import KhurungiinBurtgel from 'components/pageComponents/gereebaiguulakh/KhurungiinBurtgel'
import KhugatsaaBurtgel from 'components/pageComponents/gereebaiguulakh/KhugatsaaBurtgel'
import TulburTootsoo from 'components/pageComponents/gereebaiguulakh/TulburTootsoo'
import moment from 'moment'
const { Step } = Steps;

const steps = [
  {
    title: 'Ерөнхий мэдээлэл',
    content: YurunkhiiMedeelel,
  },
  {
    title: 'Барьцаа бүртгэл',
    content: Baritsaa,
  },
  {
    title: 'Хөрөнгийн бүртгэл',
    content: KhurungiinBurtgel,
  },
  {
    title: 'Гэрээний хугацаа',
    content: KhugatsaaBurtgel,
  },
  {
    title: 'Төлбөр тооцоо',
    content: TulburTootsoo,
  }
];

function GereeBaiguulakh() {
  const [current, setCurrent] = React.useState(0);
  const [khadgalakhGeree, setKhagalakhGeree] = React.useState({});

  const next = (data) => {
    if (current < 4)
      setCurrent(current + 1);
    if (!!data) {
      data.gereeniiDugaar = `ГД${moment(new Date()).format("YYMMDD")}`
      data.gereeniiOgnoo = new Date()
      uilchilgee().post('/api/geree', data)
    }
  };

  const prev = () => {
    if (current > 0)
      setCurrent(current - 1);
  };

  const currentItem = steps[current]

  return (
    <Admin
      khuudasniiNer="gereeBaiguulakh"
      title="Гэрээ байгуулах"
      className="grid grid-cols-12 gap-6 p-5"
    >
      <div className='col-span-12 p-2 box'>
        <Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="p-2 mt-1"><currentItem.content next={next} prev={prev} onChange={setKhagalakhGeree} value={khadgalakhGeree} /></div>
      </div>
    </Admin>
  )
}

export default GereeBaiguulakh