import useGereeniiJagsaalt from 'hooks/useGereeniiJagsaalt'
import React from 'react'
import moment from 'moment'

function Tuukh({destroy,data,token},ref) {

    const { gereeniiMedeelel, gereeniiMedeelelMutate, setGereeniiKhuudaslalt } =
    useGereeniiJagsaalt(token, data?.baiguullagiinId,data?.register)

    React.useImperativeHandle(
        ref,
        () => ({
          khaaya() {
            destroy()
          },
        }),
        []
    )

    return (
        <div>
            {gereeniiMedeelel?.jagsaalt?.map((a)=>
            <div key={a._id}>
                <div className='w-full flex flex-row'>
                    <div className='w-1/2'>Талбайн дугаар</div>
                    <div className='w-1/2'>{a.talbainiiDugaar}</div>
                </div>
                <div className='w-full flex flex-row'>
                    <div className='w-1/2'>Эхэлсэн</div>
                    <div className='w-1/2'>{moment(a.gereeniiOgnoo).format('YYYY-MM-DD')}</div>
                </div>
                <div className='w-full flex flex-row'>
                    <div className='w-1/2'>Талбайн дугаар</div>
                    <div className='w-1/2'>{moment(a.duusakhOgnoo).format('YYYY-MM-DD')}</div>
                </div>
                <div className='w-full flex flex-row'>
                    <div className='w-1/2'>Талбайн дугаар</div>
                    <div className='w-1/2'>{a.talbainiiDugaar}</div>
                </div>
            </div>)}
        </div>
    )
}

export default React.forwardRef(Tuukh)
