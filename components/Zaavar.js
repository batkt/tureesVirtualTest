import React from 'react'
import useZaavar from '../hooks/useZaavar'
import { QuestionCircleOutlined } from '@ant-design/icons'
import {Modal, Tooltip} from 'antd'

function Zaavar({token,id}) {
    const {tsonkh} = useZaavar(token,id)

    const zaavarKharya = ()=>{
        Modal.info({
            title: tsonkh?.ner,
            content: <div className='sun-editor-editable' dangerouslySetInnerHTML={{ __html: tsonkh?.zaavar }}/>,
            okText:'Хаах',
        })
    }
    return (
        <div style={{lineHeight:0}}>
            <Tooltip title='Цонхны заавар' onClick={zaavarKharya}>
                <QuestionCircleOutlined />
            </Tooltip>
        </div>
    )
}

export default Zaavar