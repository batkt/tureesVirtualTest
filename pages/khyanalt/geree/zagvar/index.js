import React from "react";
import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import _ from "lodash";
import Aos from "aos";
import { useEffect } from "react";
import GereeniiZagvarJagsaalt from "components/gereeniiZagvarJagsaalt";

function index({ token }) {
  useEffect(() => {
    Aos.init({ once: true });
  });
  return (
    <Admin
      khuudasniiNer='gereeniiZagvar'
      title='Гэрээний загвар'
      className='p-4'
      tsonkhniiId={"61c2c6101c2830c4e6f90c7d"}>
      <div className='col-span-12 flex flex-col gap-[250px]'>
        <GereeniiZagvarJagsaalt token={token} zagvaraaBichijUgnu='geree' />
        <GereeniiZagvarJagsaalt token={token} zagvaraaBichijUgnu='act' />
        {/* <div className='flex flex-col-reverse items-center sm:flex-row'>
          <Drawer
            title={kharuulakhGeree?.gereeniiDugaar}
            width={"230mm"}
            onClose={() => setKharuulakhGeree(null)}
            visible={!!kharuulakhGeree}
            footer={
              <Button type='primary' onClick={() => setKharuulakhGeree(null)}>
                {t("Хаах")}
              </Button>
            }>
            {!!kharuulakhGeree && (
              <GereeKharakh data={{ ...kharuulakhGeree, geree: {} }} />
            )}
          </Drawer>
          <div
            className='flex w-full gap-2 sm:w-auto'
            data-aos='fade-right'
            data-aos-delay='300'>
            <Button
              className=' font-medium dark:text-gray-200'
              onClick={() => router.push("/khyanalt/geree/zagvar/new")}>
              {t("Шинэ гэрээний загвар үүсгэх")}
            </Button>
            <Dropdown
              overlay={
                <Menu className='p-2'>
                  <Menu.Item
                    key='Заалт нэмэх'
                    className='dark:hover:bg-dark-2 flex items-center space-x-2 rounded-md bg-white p-2 transition duration-300 ease-in-out hover:bg-gray-200 dark:bg-gray-700'
                    onClick={zaaltOruulakh}>
                    <UserAddOutlined />
                    <span>{t("Заалт нэмэх")}</span>
                  </Menu.Item>
                  <Menu.Item
                    key='Заалт Excel-ээс оруулах'
                    className='dark:hover:bg-dark-2 flex items-center space-x-2 rounded-md bg-white p-2 transition duration-300 ease-in-out hover:bg-gray-200 dark:bg-gray-700'
                    onClick={zaaltOruulakhExcel}>
                    <UserAddOutlined />
                    <span>{t("Заалт Excel-ээс оруулах")}</span>
                  </Menu.Item>
                  <Menu.Item
                    key='Заалт Excel-ээс оруулах'
                    className='dark:hover:bg-dark-2 flex items-center space-x-2 rounded-md bg-white p-2 transition duration-300 ease-in-out hover:bg-gray-200 dark:bg-gray-700'
                    onClick={zagvarOruulakhExcel}>
                    <UserAddOutlined />
                    <span>{t("Гэрээний загвар Excel-ээс оруулах")}</span>
                  </Menu.Item>
                </Menu>
              }
              trigger='click'
              className='cursor-pointer'>
              <Button
                className='dropdown-toggle btn w-full px-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 dark:text-gray-300 md:mt-0 md:w-auto'
                aria-expanded='false'
                icon={
                  <span className='flex h-5 w-5 items-center justify-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='feather feather-plus h-4 w-4'>
                      <line x1='12' y1='5' x2='12' y2='19'></line>
                      <line x1='5' y1='12' x2='19' y2='12'></line>
                    </svg>
                  </span>
                }></Button>
            </Dropdown>
          </div>
        </div> */}
        {/* <div className='mt-5 grid grid-cols-12 gap-3 sm:gap-6'>
          {gereeniiZagvarGaralt?.jagsaalt?.map((a, i) => {
            return (
              <div
                key={a._id}
                className='col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-2'
                onClick={() => setKharuulakhGeree(a)}
                data-aos='zoom-in-up'
                data-aos-duration='1000'
                data-aos-delay={1 + index + "00"}>
                <div className='file box zoom-in relative rounded-md px-3 pb-5 pt-8 shadow-lg dark:shadow-lg dark:shadow-white sm:px-5'>
                  <div className='absolute left-0 top-0 ml-3 mt-3'></div>

                  <div className='file__icon file__icon--file mx-auto w-3/5'>
                    <div className='file__icon__file-name'></div>
                  </div>
                  <div className='mt-4 block truncate text-center font-medium'>
                    {a.ner}
                  </div>
                  <div className='mt-0.5 text-center text-xs text-gray-600 dark:text-gray-400'>
                    {t(a.turGereeEsekh === true ? "Түр гэрээ" : "Үндсэн гэрээ")}
                  </div>
                  <div className='dropdown absolute right-0 top-0 ml-auto mr-2 mt-2'>
                    <Dropdown
                      trigger='click'
                      overlay={
                        <div className='dropdown-menu w-40'>
                          <div className='dropdown-menu__content box dark:bg-dark-1 p-2'>
                            <div
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(`/khyanalt/geree/zagvar/${a._id}`);
                              }}
                              className='dark:bg-dark-1 dark:hover:bg-dark-2 flex cursor-pointer items-center rounded-md bg-white p-2 transition duration-300 ease-in-out hover:bg-gray-200 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='24'
                                height='24'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='1.5'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                className='feather feather-users mr-2 h-4 w-4'>
                                <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'></path>
                                <circle cx='9' cy='7' r='4'></circle>
                                <path d='M23 21v-2a4 4 0 0 0-3-3.87'></path>
                                <path d='M16 3.13a4 4 0 0 1 0 7.75'></path>
                              </svg>
                              {t("Засах")}
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                              <Popconfirm
                                title={t("Загвар устгах уу?")}
                                okText={t("Тийм")}
                                cancelText={t("Үгүй")}
                                className=' dark:bg-dark-1 dark:hover: bg-dark-2 hover: flex cursor-pointer items-center rounded-md bg-white p-2 text-white transition duration-300 ease-in-out hover:bg-gray-200 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800'
                                onConfirm={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  deleteMethod(
                                    "gereeniiZagvar",
                                    token,
                                    a._id
                                  ).then(() => {
                                    gereeniiZagvarMutate();
                                    message.success(
                                      t("Гэрээний загвар устгагдлаа")
                                    );
                                  });
                                }}>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  width='24'
                                  height='24'
                                  viewBox='0 0 24 24'
                                  fill='none'
                                  stroke='currentColor'
                                  strokeWidth='1.5'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  className='feather feather-trash mr-2 h-4 w-4 text-red-600'>
                                  <polyline points='3 6 5 6 21 6'></polyline>
                                  <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'></path>
                                </svg>
                                <p className='text-red-600'>{t("Устгах")}</p>
                              </Popconfirm>
                            </div>
                          </div>
                        </div>
                      }>
                      <div
                        className='dropdown-toggle block h-5 w-5'
                        aria-expanded='false'
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='feather feather-more-vertical h-5 w-5 text-gray-600'>
                          <circle cx='12' cy='12' r='1'></circle>
                          <circle cx='12' cy='5' r='1'></circle>
                          <circle cx='12' cy='19' r='1'></circle>
                        </svg>
                      </div>
                    </Dropdown>
                  </div>
                </div>
              </div>
            );
          })}
        </div> */}
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default index;
