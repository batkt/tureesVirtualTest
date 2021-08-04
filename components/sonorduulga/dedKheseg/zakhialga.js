import { Tooltip } from 'antd'
import React from 'react'
import moment from 'moment'
import { url } from 'services/uilchilgee'

function Zakhialga({ onClose, token, ...object }) {
    const { mashiniiDugaar, ognoo, zakhialguud } = object


    function sonorduulgaKharlaa() {
        window.location.href = `/khyanalt/ajiltanKhyanalt/ajiltaniiZakhialguud/${object?.ajiltniiId}`
        onClose()
    }

    return (
        <div id="notification-with-split-buttons-content" className="flex flex-row items-center" onClick={onClose}>
            <div className='mr-2 flex'>
                {zakhialguud.map((mur, i) => {
                    return (
                        <Tooltip key={i} title={mur.ner}>
                            <img alt={mur.zurgiinNer} className={`w-10 h-10 zoom-in rounded-full ${i !== 0 ? '-ml-5' : ''}`} src={mur.zurgiinNer ? `${url}/zuragAvya/${mur.zurgiinNer}` : '/car-repair.png'} />
                        </Tooltip>
                    )
                })}
            </div>
            <div className="md:mr-40">
                <div className="font-medium">Хуваарилсан захиалга</div>
                <div className="text-gray-600 mt-1">{moment(ognoo).format('YYYY-MM-DD')}</div>
                <div className="text-gray-600 mt-1">{mashiniiDugaar}</div>
            </div>
            <div className="absolute top-0 bottom-0 right-0 flex-col border-l border-gray-200 dark:border-dark-5 hidden md:flex">
                <a className="flex-1 flex items-center justify-center px-6 font-medium text-theme-1 dark:text-gray-500 border-b border-gray-200 dark:border-dark-5" onClick={sonorduulgaKharlaa}>
                    Дэлгэрэнгүй
                </a>
                <a data-dismiss="notification" className="flex-1 flex items-center justify-center px-6 font-medium text-gray-600" onClick={onClose}>Хаах</a>
            </div>
        </div>
    )
}

export default Zakhialga
