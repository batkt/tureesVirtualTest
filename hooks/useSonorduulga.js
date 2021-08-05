import { notification } from 'antd'
import axios, { socket, aldaaBarigch } from 'services/uilchilgee'
import useSWR from 'swr'
import Sonorduulga from 'components/sonorduulga'
import { useEffect, useState } from 'react'
const fetcher = (url, token, ajiltniiId, { jagsaalt, ...khuudaslalt }) => axios(token).post(url, { ...khuudaslalt, query: { ajiltniiId }, order: { kharsanEsekh: 0 } }).then(res => res.data).catch(aldaaBarigch)
var sonorduulgaId = null

function useSonorduulga(token, ajiltniiId) {
    const [khuudaslalt, setKhuudaslalt] = useState({ khuudasniiDugaar: 1, khuudasniiKhemjee: 10, jagsaalt: [] })
    const { data, mutate } = {}

    useEffect(() => {
        if (ajiltniiId) {
            socket().on(`ajiltan${ajiltniiId}`, sonorduulga => {
                const key = `${Math.floor(Math.random() * 100)}+${Date.now()}`
                mutate()
                if (!!sonorduulga && sonorduulgaId !== sonorduulga?._id) {
                    function onClose() {
                        notification.close(key)
                    }
                    notification.open({
                        key: key,
                        message: <Sonorduulga {...sonorduulga} onClose={onClose} />,
                        closeIcon: () => null,
                        duration: 100000
                    });
                    sonorduulgaId = sonorduulga?._id
                }
            })
        }
    }, [ajiltniiId])

    return { setKhuudaslalt, sonorduulga: data, sonorduulgaMutate: mutate, jagsaalt: khuudaslalt.jagsaalt }
}

export default useSonorduulga