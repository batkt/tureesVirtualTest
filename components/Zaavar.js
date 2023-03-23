import React, { useMemo } from 'react'
import useZaavar from '../hooks/useZaavar'
import { QuestionCircleOutlined } from '@ant-design/icons'
import {Modal, Tooltip} from 'antd'
import { useTranslation } from 'react-i18next'

function Zaavar({token,id}) {
    const {tsonkh} = useZaavar(token,id)
    const { t, i18n } = useTranslation()
    const ner = useMemo(()=> {
        var utga = undefined
        switch (tsonkh?.ner) {
          case "Хяналт":
            utga = "Dashboard"
            break;
            case "Хяналтын цонх":
            utga = "Хяналтын цонх"
            break;
            case "Гэрээ":
            utga = "Contracts"
            break;
            case "Гэрээний жагсаалт":
              utga = "ContractList"
              break;
              case "Гэрээ байгуулах":
                utga = "SingContractExecutingAContract"
                break;
                case "Гэрээний загвар":
                  utga = "ContractDrafts"
                  break;
                  case "Талбай бүртгэл":
                    utga = "AreaRegisteration"
                    break;
                    case "Ажилтан бүртгэл":
                      utga = "UserRegisteration"
                      break;
                      case "Харилцагч":
                        utga = "Tenant"
                        break;
                        case "Мэдэгдэл":
                        utga = "Announcement"
                        break;
                        case "Шаардлага":
                        utga = "Requirement"
                        break;
                        case "Санал хүсэлт":
                        utga = "Feedback"
                        break;
                        case "Төлбөр тооцоо":
                        utga = "Payment"
                        break;
                        case "Дансны хуулга":
                        utga = "AccountStatement"
                        break;
                        case "Гүйлгээний түүх":
                        utga = "TransactionHistory"
                        break;
                        case "Нэхэмжлэл":
                        utga = "Invoice"
                        break;
                        case "Зардал":
                        utga = "Costs"
                        break;
                        case "И-баримт":
                        utga = "E-Barimt"
                        break;
                        case "Зогсоол":
                        utga = "Park"
                        break;
                        case "Жагсаалт":
                        utga = "List"
                        break;
                        case "Машин бүртгэл":
                        utga = "VehicleRegistration"
                        break;
                        case "Анкет":
                        utga = "application"
                        break;
                        case "Тайлан":
                        utga = "Statement"
                        break;
                        case "График":
                        utga = "Graphic"
                        break;
                        case "Аналитик":
                        utga = "Analytics"
                        break;
                        case "Даалгавар":
                        utga = "Tasks"
                        break;
                        case "Устгасан түүх":
                        utga = "DeletedHistory"
                        break;
    
        
          default:
            utga = tsonkh?.ner
            break;
        }
        return utga
      },[tsonkh])

    const zaavarKharya = ()=>{
        Modal.info({
            className:'p-0',
            title: t(ner),
            content: <div className='sun-editor-editable' dangerouslySetInnerHTML={i18n.language === "mn" ? { __html: tsonkh?.zaavar } : { __html: tsonkh?.zaavarEN }}/>,
            okText: t("Хаах"),
            style:{minWidth:'50vw'}
        })
    }
    if(!!tsonkh?.zaavar)
    return (
        <div className='cursor-pointer' style={{lineHeight:0}}>
            <Tooltip title={t("Цонхны заавар")} onClick={zaavarKharya}>
            <img className='h-5' src='/infoRently.png'/>
            </Tooltip>
        </div>
    )
    else return null
}

export default Zaavar