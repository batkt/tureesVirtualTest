import React from 'react'

function Aldaa() {

    function butsakh() {
        window.history.back()
    }
    return (
        <div className='w-screen bg-blue-700 dark:bg-gray-800'>
            <div className="container">
                <div className="error-page flex flex-col lg:flex-row items-center justify-center h-screen text-center lg:text-left">
                    <div className="-intro-x lg:mr-20">
                        <img alt="Rubick Tailwind HTML Admin Template" className="h-48 lg:h-auto" src="/error-illustration.svg" />
                    </div>
                    <div className="text-white mt-10 lg:mt-0">
                        <div className="intro-x text-8xl font-medium">404</div>
                        <div className="intro-x text-xl lg:text-3xl font-medium mt-5">Уучлаарай хуудас олдсонгүй.</div>
                        <div className="intro-x text-lg mt-3">Та хуудасны замыг буруу оруулсан бололтой эсвэл энэ хуудас устгагдсан байна.</div>
                        <br />
                        <button className="intro-x btn py-3 px-4 text-white border-white dark:border-dark-5 dark:text-gray-300 mt-10 border" onClick={butsakh}>Нүүр хуудас руу буцах</button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Aldaa