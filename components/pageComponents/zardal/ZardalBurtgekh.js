import React, { useImperativeHandle,useMemo,useState } from "react"
import { Breadcrumb, Button, Input, message } from "antd"
import createMethod from "tools/function/crud/createMethod"
import updateMethod from "tools/function/crud/updateMethod"
import BreadcrumbItem from "antd/lib/breadcrumb/BreadcrumbItem"
import _ from 'lodash'
import { ArrowRightOutlined, CloseOutlined } from "@ant-design/icons"

function ZardalBurtgekh({ data={}, barilgiinId, token, destroy, onRefresh }, ref) {

    const [zardal,setZardal] = useState(data)
    const [zam,setZam] = useState('')
    const [tuukh,setTuukh] = useState([])

    useImperativeHandle(
      ref,
      () => ({
        khadgalya() {
          zardal.barilgiinId = barilgiinId
          const method = zardal?._id ? updateMethod : createMethod
          method("zardal", token, zardal).then(({ data }) => {
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

    const zardalData = useMemo(()=>{
      if(zam === '')
        return zardal
      return _.get(zardal,zam)
    },[zardal,zam])

    function onChangeZardal({target}) {
      _.set(zardal,zam + (zam === '' ? '' : '.') +'ner',target.value)
      setZardal({...zardal})
    }

    function onClickSub(index) {
      tuukh.push({zam,ner:zardalData?.ner})
      setTuukh([...tuukh])
      let zamiinUtga = zam + (zam !== '' ? '.' : '') + 'dedKhesguud.'+index
      setZam(zamiinUtga)
    }

    function tuukhButsaaya(v) {
      setZam(v.zam)
      const index = tuukh.findIndex(a=>a.zam === v.zam)
      if(index !== -1){
        tuukh.splice(index,100)
        setTuukh([...tuukh])
      }
    }

    function dedBulegNemekh() {
      _.set(zardal,zam+(zam === '' ? '' : '.')+'dedKhesguud',[{ner:'Зардалын төрөл'}])
      setZardal({...zardal})
    }

    function murUstgaya(e,index) {
      e.stopPropagation()
      const jagsaalt = _.get(zardal,zam+(zam === '' ? '' : '.')+'dedKhesguud')
      jagsaalt.splice(index,1)
      _.set(zardal,zam+(zam === '' ? '' : '.')+'dedKhesguud',jagsaalt)
      setZardal({...zardal})
    }

    function zardalNemekh() {
      const jagsaalt = _.get(zardal,zam+(zam === '' ? '' : '.')+'dedKhesguud')
      jagsaalt.push({ner:'Зардалын төрөл'})
      _.set(zardal,zam+(zam === '' ? '' : '.')+'dedKhesguud',jagsaalt)
      setZardal({...zardal})
    }
  
    return (
      <div className={`grid grid-cols-2 gap-5`}>
        <div className="col-span-2">
          <Breadcrumb separator="/">
            {tuukh.map((a)=><BreadcrumbItem className="cursor-pointer" key={a.zam} onClick={()=>tuukhButsaaya(a)}><a>{a.ner}</a></BreadcrumbItem>)}
          </Breadcrumb>
        </div>
        <div className={`space-y-2 ${!!zardalData?.dedKhesguud ? '' : 'col-span-2'}`}>
            <div>Зардал</div>
            <Input placeholder="Нэр" value={zardalData?.ner || ''} onChange={onChangeZardal}/>
            {!zardalData?.dedKhesguud && <Button onClick={dedBulegNemekh}>Дэд зардал бүртгэх</Button>}
        </div>
        <div className={`${!!zardalData?.dedKhesguud ? 'space-y-2' : 'hidden'}`}>
            <div>Дэд</div>
            {zardalData?.dedKhesguud?.map((a,i)=>
              <div key={`${a.ner}-${i}`} className='w-full p-1 border border-gray-200 cursor-pointer flex justify-between items-center' onClick={()=>onClickSub(i)}>
                <span>{a.ner}</span>
                {
                  !!a.dedKhesguud ? 
                    <ArrowRightOutlined style={{display:'flex'}}/>
                    :
                    <CloseOutlined style={{display:'flex'}} onClick={(e)=>murUstgaya(e,i)}/>
                }
              </div>
            )}
            <Button onClick={zardalNemekh}>Зардал нэмэх</Button>
        </div>
      </div>
    )
}

export default React.forwardRef(ZardalBurtgekh)