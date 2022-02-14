import { Modal } from 'antd'
import socketIOClient from 'socket.io-client'
import { useEffect } from 'react'

export const url = "http://103.50.205.33:8282"

export const socket = () => socketIOClient(url, { transports: ["websocket"] })

const refreshPage = ()=>{
    window.location.reload();
}

function Updater() {
    useEffect(()=>{
        socket().on("tureesFront", medegdel => {
            if(!medegdel?.err)
            Modal.info({
                title: 'Мэдэгдэл',
                content: <div>Системд шинэчлэлт хийгдсэн байна. Шинэчлэлт хийхийн тулд <b>сэргээх</b> товчийг дарна уу!</div>,
                onOk:refreshPage,
                okText:'Сэргээх',
                cancelText:'Хаах',
                okCancel:true
            });
        })
    },[])

    return <div></div>
}

export default Updater