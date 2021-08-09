import { Drawer, Menu, Switch } from 'antd';
import Link from 'next/link';
import React, { useState } from 'react'
import { url } from 'services/uilchilgee';

function MTses({ khuudasnuud, khuudasniiNer, baiguullaga, themeValue, setTheme }) {
    const [visible, setVisible] = useState(false);
    return (
        <div className='flex md:hidden mr-2'>
            <button
                className="border-none outline-none"
                onClick={() => setVisible(!visible)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-align-justify block mx-auto h-8 w-8 dark:text-gray-100"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>
            </button>
            <Drawer
                title="Hi Car"
                placement={"left"}
                closable={false}
                onClose={() => setVisible(false)}
                visible={visible}
                key={"left"}
                bodyStyle={{ padding: "10px 0" }}
                footer={<div className='h-8 justify-center items-center flex'>
                    <div className="mr-4 text-gray-700 dark:text-gray-300 whitespace-nowrap flex">Dark Mode</div>
                    <Switch checked={themeValue} onClick={() => setTheme(themeValue ? 'light' : 'dark')} />
                </div>}
            >
                <Menu
                    mode="inline"
                    className="w-full"
                    selectedKeys={[khuudasniiNer]}
                >
                    <div className='h-14 border-b px-2'>
                        <div className='flex flex-row items-center space-x-2'>
                            <img className='h-10 w-10 rounded-full border-solid border-2 border-blue-500' alt={baiguullaga?.ner} src={baiguullaga?.zurgiinNer ? `${url}/logoAvya/${baiguullaga?.zurgiinNer}` : '/rent.png'} />
                            <div className='dark:text-gray-100 text-xl'>{baiguullaga?.ner}</div>
                        </div>
                    </div>
                    {khuudasnuud.map((mur) => (
                        <Menu.Item key={mur.khuudasniiNer}>
                            <Link href={mur.href}>
                                <a>{mur.ner}</a>
                            </Link>
                        </Menu.Item>
                    ))}
                </Menu>
            </Drawer>
        </div>
    )
}

export default MTses
