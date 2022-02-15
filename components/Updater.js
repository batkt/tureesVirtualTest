import { Button, Menu, Modal, notification } from 'antd'
import socketIOClient from 'socket.io-client'
import { useEffect, useState } from 'react'
import { InfoCircleOutlined, ReloadOutlined } from '@ant-design/icons'

export const url = "http://103.50.205.33:8282"

export const socket = () => socketIOClient(url, { transports: ["websocket"] })

const refreshPage = ()=>{
    window.location.reload();
}

var medegdelIrsenEsekh = null

function Updater() {

    const [medegdel,setMedegdel] = useState(null)

    useEffect(()=>{
        socket().on("tureesFront", medegdel => {
            if(!medegdel?.err && !medegdelIrsenEsekh){
                medegdelIrsenEsekh = true
                let notif = {
                    icon:<div className='text-yellow-500'><InfoCircleOutlined/></div>,
                    message:'Мэдэгдэл',
                    description:<div style={{maxWidth:'20rem'}} className='break-words'>Системд шинэчлэлт хийгдсэн байна. Та шинэчлэлт хийх үү!<div><Button style={{marginTop:0,marginLeft:'auto'}} size='small' type='primary' onClick={refreshPage}>Тийм</Button></div></div>
                }
                notification.info(notif)
                //setMedegdel(notif)
            }
        })
        return ()=>{
            socket().off("tureesFront")
        }
    },[])

    if(medegdel)
        return (
                <div className='flex flex-row bg-gray-100 rounded-md p-2 space-x-2'>
                    <div className='text-xl'>
                        {medegdel.icon}
                    </div>
                    <div>
                        <div>{medegdel.message}</div>
                        {medegdel.description}
                    </div>
                </div>
        )
    return null
}

export default Updater