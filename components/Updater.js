import { notification } from 'antd'
import socketIOClient from 'socket.io-client'
import { useEffect } from 'react'

export const url = "http://103.50.205.33:8282"

export const socket = () => socketIOClient(url, { transports: ["websocket"] })

const refreshPage = ()=>{
    window.location.reload();
}

function Updater() {
    useEffect(()=>{
        socket().on("turees", medegdel => {
          notification.info({message:'sda',description:'',onClick:refreshPage})  
        })
    },[])
    return <div></div>
}

export default Updater