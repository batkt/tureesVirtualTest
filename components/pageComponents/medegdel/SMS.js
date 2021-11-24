import { Input } from 'antd'
import React from 'react'

function SMS() {
    return (
        <>
            <div className="box px-5 pt-5 pb-5 lg:pb-0 mt-5">
                <div className="text-gray-700 dark:text-gray-300">
                    <Input.Search/>
                </div>
                <div className="overflow-x-auto scrollbar-hidden">
                    <div className="flex mt-5">
                        <div className="w-10 mr-4 cursor-pointer">
                            <div className="w-10 h-10 flex-none image-fit rounded-full relative">
                                <img alt="Rubick" className="rounded-full" src="/profile.svg"/>
                                <div className="w-3 h-3 bg-theme-9 absolute right-0 bottom-0 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="text-xs text-gray-600 truncate text-center mt-2">Brad Pitt</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="intro-x cursor-pointer box relative flex items-center p-5 mt-5">
                <div class="w-12 h-12 flex-none image-fit mr-1">
                    <img alt="Rubick Tailwind HTML Admin Template" class="rounded-full" src="/profile.svg"/>
                    <div class="w-3 h-3 bg-theme-9 absolute right-0 bottom-0 rounded-full border-2 border-white"></div>
                </div>
                <div class="ml-2 overflow-hidden">
                    <div class="flex items-center">
                        <a href="javascript:;" class="font-medium">Brad Pitt</a> 
                        <div class="text-xs text-gray-500 ml-auto">01:10 PM</div>
                    </div>
                    <div class="w-full truncate text-gray-600 mt-0.5">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500</div>
                </div>
                <div class="w-5 h-5 flex items-center justify-center absolute top-0 right-0 text-xs text-white rounded-full bg-theme-1 font-medium -mt-1 -mr-1">4</div>
            </div>
        </>
    )
}


export function SMSContent() {
    return (
        <div class="h-full flex items-center box">
            <div class="mx-auto text-center">
                <div class="w-16 h-16 flex-none image-fit rounded-full overflow-hidden mx-auto">
                    <img alt="Rubick Tailwind HTML Admin Template" src="/profile.svg"/>
                </div>
                <div class="mt-3">
                    <div class="font-medium">Hey, Brad Pitt!</div>
                    <div class="text-gray-600 mt-1">Please select a chat to start messaging.</div>
                </div>
            </div>
        </div>
    )
}

export default SMS
