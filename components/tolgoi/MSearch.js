import { SearchOutlined } from '@ant-design/icons'
import React from 'react'

function MSearch({ className, onClick }) {

    return (
        <div id='mobileSearch' className={className} onClick={onClick}>
            <button className="h-8 w-8 flex rounded-full items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
                <SearchOutlined className='text-xl dark:text-gray-50 flex items-center justify-center' />
            </button>
        </div>
    )
}

export default MSearch
