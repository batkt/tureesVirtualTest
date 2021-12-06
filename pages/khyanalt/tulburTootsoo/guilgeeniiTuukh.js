//#region imports
import shalgaltKhiikh from "services/shalgaltKhiikh";
import uilchilgee from "services/uilchilgee";
import Admin from "components/Admin";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "services/auth";
import { Card, Table, Button, DatePicker, Spin, Tooltip } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import moment from "moment";
import formatNumber from "../../../tools/function/formatNumber";
import GuilgeeKhiikh from "../../../components/pageComponents/tulbur/GuilgeeKhiikh";
import Khungulukh from "../../../components/pageComponents/tulbur/Khungulukh";
import GuilgeeniiTuukh from "../../../components/pageComponents/tulbur/GuilgeeniiTuukh";
import _ from "lodash";
import { modal } from "components/ant/Modal";
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt";
import useGuilgeeniiToololtAvya from "hooks/useGuilgeeniiToololtAvya";
import useSWR from "swr";
//#endregion

function GereeniiUldegdel({ugugdul,token}) {
  const {barilgiinId} = useAuth()
  const {data} = useSWR(!!ugugdul?.gereeniiDugaar && !!barilgiinId ? ['/uldegdelBodyo',barilgiinId,ugugdul?.gereeniiDugaar] : null,(url,barilgiinId,gereeniiDugaar)=>uilchilgee(token).post(url,{barilgiinId,gereeniiDugaar}).then(({data})=>data),{
    revalidateOnFocus: false,
  })
  
  return (
    <div
      className={`font-medium ${
        data?.uldegdel > 0 ? "text-red-500" : "text-green-500"
      }`}
    >
      {!data ? <Spin size='small'/> : formatNumber(data?.uldegdel)}
    </div>
  )
}

function guilgeeniiTuukh({ token }) {
  //#region state
  const ref = React.useRef(null);
  const refTuukh = React.useRef(null);
  const { baiguullaga } = useAuth();
  const [delgegdsenGeree, setDelgegdsenGeree] = React.useState(null);
  const [ognoo, setOgnoo] = React.useState([moment(moment().startOf("month").format('YYYY-MM-DD 00:00:00')),moment(moment().endOf("month").format('YYYY-MM-DD 23:59:59'))]);
  const [turul, setTurul] = React.useState('');
  const [loadingIndex, setLoadingIndex] = React.useState(0);
  
  const { guilgeeniiToololt } = useGuilgeeniiToololtAvya(
    token,
    ognoo
  );

  const query = React.useMemo(() => {
    if(turul === 'uglug')
      return {
        'avlaga.guilgeenuud.ognoo': {
          '$lte': moment(ognoo[1]).format("YYYY-MM-DD 23:59:59")
        },
        'baiguullagiinId': baiguullaga._id,
        'tuluv': {
          '$ne': -1
        },
        "uldegdel": {
          "$lt": 0
        }
      }
    else if(turul === 'avlaga')
      return {
        'avlaga.guilgeenuud.ognoo': {
          '$lte': moment(ognoo[1]).format("YYYY-MM-DD 23:59:59")
        },
        'baiguullagiinId': baiguullaga._id,
        'tuluv': {
          '$ne': -1
        },
        "uldegdel": {
          "$gte": 0
        }
      }
    else if(turul === 'khugatsaaKhetersen')
      return {
        'daraagiinTulukhOgnoo': {
          '$lte': moment(ognoo[1]).format("YYYY-MM-DD 23:59:59")
        },
        'baiguullagiinId': baiguullaga._id,
        'tuluv': {
          '$ne': -1
        },
        "uldegdel": {
          "$gte": 0
        }
      }
    else if(turul === 'eneSardTulukh')
      return {
          'avlaga.guilgeenuud.ognoo': {
            '$gte': moment(ognoo[0]).startOf("month").format("YYYY-MM-DD 00:00:00"),
            '$lte': moment(ognoo[1]).endOf("month").format("YYYY-MM-DD 23:59:59")
          },
          'baiguullagiinId': baiguullaga?._id,
          'avlaga.guilgeenuud.tulukhDun': {
            '$gt': 0
        }
      }
    else if(turul === 'eneSardTulsun')
      return {
        'avlaga.guilgeenuud.ognoo': {
          '$gte': moment(ognoo[0]).startOf("month").format("YYYY-MM-DD 00:00:00"),
          '$lte': moment(ognoo[1]).endOf("month").format("YYYY-MM-DD 23:59:59")
        },
        'baiguullagiinId': baiguullaga?._id,
        'avlaga.guilgeenuud.tulsunDun': {
          '$gt': 0
        }
      }
    else if(turul === 'khungulult')
      return {
          'avlaga.guilgeenuud.ognoo': {
            '$gte': moment(ognoo[0]).startOf("month").format("YYYY-MM-DD 00:00:00"),
            '$lte': moment(ognoo[1]).endOf("month").format("YYYY-MM-DD 23:59:59")
          },
          'baiguullagiinId': baiguullaga?._id,
          'avlaga.guilgeenuud.khyamdral': {
            '$gt': 0
        }
      }
    return {};
  }, [turul,ognoo]);

  const { gereeniiMedeelel, setGereeniiKhuudaslalt, gereeniiMedeelelMutate } =
  useGereeniiJagsaalt(token, baiguullaga?._id, undefined, query);
 
  const columns = useMemo(()=>[
    {
      title: "№",
      key: "index",
      width: "3rem",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Талбай",
      dataIndex: "talbainDugaar",
      ellipsis: true,
      align: "center",
      width: "5rem",
    },
    {
      title: "Давхар",
      dataIndex: "davkhar",
      ellipsis: true,
      align: "center",
      width: "5rem",
      showSorterTooltip: false,
      defaultSortOrder: "descend",
      sorter: (a, b) => Number(a.davkhar || 0) - Number(b.davkhar || 0),
    },
    {
      title: "Түрээслэгч",
      dataIndex: "ner",
      ellipsis: true,
      align: "left",
      width: "12rem",
    },
    { title: "Утас", dataIndex: "utas", ellipsis: true, align: "center" },
    {
      title: "Үлдэгдэл",
      dataIndex: "uldegdel",
      align: "right",
      render(text, record, index) {
        return (
            <GereeniiUldegdel token={token} ugugdul={record} index={index} show={index === loadingIndex} setLoadingIndex={setLoadingIndex} urt={gereeniiMedeelel?.jagsaalt?.length}/>
          );
      },
      showSorterTooltip: false,
      defaultSortOrder: "descend",
      sorter: (a, b) => Number(a.uldegdel || 0) - Number(b.uldegdel || 0),
    },
    {
      title: "Гэрээний огноо",
      dataIndex: "gereeniiOgnoo",
      ellipsis: true,
      align: "center",
      render(a) {
        return moment(a).format("YYYY-MM-DD");
      },
    },
    {
      title: "Үйлдэл",
      ellipsis: true,
      render: (row) => (
        <div className='flex flex-row divide-x-2 '>
          <a onClick={() => guilgeeKhiiya(row)} className='px-2 fill-current text-green-500'>
            <Tooltip title='Гүйлгээ хийх'>
              <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                width="440.000000pt" height="377.000000pt" viewBox="0 0 440.000000 377.000000"
                preserveAspectRatio="xMidYMid meet" className='fill-current text-green-500 w-8 h-6 p-1'>
                <g transform="translate(0.000000,377.000000) scale(0.100000,-0.100000)"
                stroke="none">
                <path d="M3080 3510 c-52 -14 -88 -40 -106 -77 -17 -34 -19 -67 -22 -285 l-3
                -248 -549 0 c-418 0 -556 -3 -577 -12 -45 -21 -71 -48 -89 -94 -14 -36 -14
                -48 -4 -81 20 -58 37 -80 86 -102 43 -21 56 -21 674 -21 545 0 636 2 667 15
                87 37 103 75 103 246 0 71 3 129 7 129 10 0 693 -683 693 -693 0 -12 -678
                -687 -690 -687 -6 0 -10 49 -10 130 0 133 -4 150 -44 198 -47 54 -10 52 -938
                52 l-858 0 0 238 c0 227 -1 240 -22 282 -41 80 -119 110 -199 76 -36 -16
                -1128 -1102 -1148 -1143 -14 -28 -14 -108 0 -136 6 -12 261 -273 568 -580 632
                -634 603 -610 704 -564 88 40 91 54 95 350 l3 247 548 0 c581 0 591 1 633 47
                10 10 25 36 33 58 32 75 -18 168 -102 193 -29 9 -209 12 -662 12 -537 0 -627
                -2 -658 -15 -86 -36 -103 -76 -103 -241 0 -91 -3 -124 -12 -124 -13 0 -688
                670 -688 682 0 12 678 688 690 688 6 0 10 -47 10 -124 0 -131 7 -166 43 -204
                50 -53 24 -52 943 -52 l854 0 0 -236 c0 -215 2 -239 21 -283 14 -34 31 -54 58
                -69 42 -24 109 -29 144 -11 28 14 1089 1071 1128 1123 23 31 29 50 29 88 0 27
                -6 61 -14 76 -8 15 -266 277 -573 583 -488 486 -563 558 -598 566 -22 5 -51 6
                -65 3z"/>
                </g>
              </svg>
            </Tooltip>
          </a>
          <a onClick={() => khungulultKhiiya(row)} className="px-2">
            <Tooltip title='Хөнгөлөх'>
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
              width="575.000000pt" height="376.000000pt" viewBox="0 0 575.000000 376.000000"
              preserveAspectRatio="xMidYMid meet" className='fill-current text-green-500 w-8 h-6 p-1'>

              <g transform="translate(0.000000,376.000000) scale(0.100000,-0.100000)"
              stroke="none">
              <path d="M715 3630 c-109 -22 -224 -88 -300 -172 -55 -62 -110 -172 -124 -252
              -15 -83 -15 -2529 0 -2612 17 -93 71 -196 142 -268 76 -76 154 -121 255 -146
              75 -19 133 -20 2123 -20 1990 0 2048 1 2121 19 110 28 174 65 254 145 73 74
              115 145 140 241 21 77 20 2596 -1 2674 -23 87 -64 159 -131 230 -65 69 -121
              106 -221 144 l-58 22 -2080 1 c-1144 1 -2098 -2 -2120 -6z m1145 -403 l0 -193
              55 -29 55 -30 55 30 55 29 0 193 0 193 1408 -2 1407 -3 51 -27 c73 -38 106
              -69 139 -130 l30 -53 3 -572 3 -573 -1033 0 -1033 0 -22 -39 c-12 -21 -45 -68
              -73 -102 l-51 -64 1105 -3 1106 -2 0 -613 c-1 -489 -4 -620 -14 -650 -32 -89
              -106 -159 -200 -190 -45 -16 -173 -17 -1438 -17 l-1388 0 -1 513 -1 512 -54
              49 -55 50 -54 -54 -55 -54 0 -508 0 -509 -562 3 c-553 3 -564 3 -610 25 -66
              30 -132 95 -159 156 l-24 52 -3 617 -3 618 267 2 267 3 -41 47 c-22 26 -55 72
              -74 102 l-33 55 -193 1 -193 0 3 563 3 562 23 50 c38 82 115 149 202 176 14 4
              274 8 578 8 l552 1 0 -193z"/>
              <path d="M1430 2889 c-79 -15 -188 -76 -254 -143 -288 -289 -157 -775 239
              -885 22 -6 98 -11 170 -11 l130 0 -228 -228 -227 -227 73 -73 c40 -39 77 -72
              82 -72 6 0 132 123 282 272 l273 273 273 -273 c150 -149 277 -272 282 -272 5
              0 42 33 82 72 l73 73 -227 227 -228 228 130 0 c72 0 148 5 170 11 234 65 395
              277 395 518 -1 284 -240 521 -525 521 -135 0 -268 -53 -367 -147 l-58 -56 -61
              57 c-131 121 -302 169 -479 135z m259 -238 c60 -31 104 -77 138 -141 28 -54
              28 -58 31 -254 l4 -198 -194 3 c-188 4 -195 5 -250 32 -181 89 -234 314 -112
              474 30 40 99 88 145 102 58 18 188 8 238 -18z m836 4 c63 -30 129 -103 154
              -168 58 -156 -8 -321 -157 -394 -55 -27 -62 -28 -249 -32 l-193 -3 0 179 c0
              197 9 247 58 318 30 44 106 99 156 115 50 15 185 6 231 -15z"/>
              <path d="M3474 976 c-38 -38 -44 -77 -19 -126 20 -38 43 -50 97 -50 100 0 143
              120 67 184 -46 39 -101 36 -145 -8z"/>
              <path d="M3811 996 c-58 -32 -69 -119 -22 -167 24 -23 38 -29 73 -29 52 0 85
              21 104 66 12 29 12 39 -2 74 -25 63 -95 88 -153 56z"/>
              <path d="M4110 981 c-50 -49 -52 -105 -6 -154 21 -22 34 -27 73 -27 56 0 85
              17 103 59 44 106 -90 202 -170 122z"/>
              <path d="M4438 993 c-32 -20 -48 -52 -48 -99 0 -84 110 -126 178 -69 99 83
              -20 236 -130 168z"/>
              </g>
              </svg>
            </Tooltip>
          </a>
          {row?._id === delgegdsenGeree && (
            <a className="px-2" onClick={() => refTuukh.current.khevlekh()}>
              <Tooltip title='Хэвлэх'>
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                    width="428.000000pt" height="438.000000pt" viewBox="0 0 428.000000 438.000000"
                    preserveAspectRatio="xMidYMid meet" className='fill-current text-green-500 w-6 h-6 p-1'>

                    <g transform="translate(0.000000,438.000000) scale(0.100000,-0.100000)"
                    stroke="none">
                    <path d="M1104 4166 c-62 -19 -130 -73 -167 -130 l-32 -51 -3 -507 -3 -508
                    -74 0 -75 0 0 -445 0 -445 1365 0 1365 0 0 445 0 445 -79 0 -80 0 -3 278 -3
                    277 -27 58 c-19 39 -58 90 -125 159 -54 56 -111 116 -128 133 -113 120 -222
                    230 -249 250 -73 55 -75 55 -890 54 -586 0 -760 -3 -792 -13z m1500 -157 c51
                    -40 56 -64 56 -251 0 -195 8 -224 69 -265 32 -21 45 -23 185 -23 173 0 209
                    -10 238 -70 16 -31 18 -69 18 -322 l0 -288 -1060 0 -1060 0 0 563 c0 638 -3
                    610 80 654 l43 23 702 0 c697 0 703 0 729 -21z"/>
                    <path d="M346 2909 c-54 -13 -91 -42 -115 -92 -21 -43 -21 -53 -21 -830 l0
                    -787 345 0 345 0 0 -320 c0 -176 0 -322 0 -325 0 -3 11 -26 24 -53 39 -75 91
                    -123 161 -146 40 -14 166 -16 1029 -16 666 -1 992 3 1012 10 50 18 76 34 108
                    66 80 81 86 116 86 482 l0 302 350 0 350 0 0 788 c0 502 -4 800 -10 822 -27
                    91 -80 111 -290 107 l-135 -2 -3 -467 -2 -468 -1465 0 -1465 0 -2 468 -3 467
                    -130 1 c-72 1 -147 -3 -169 -7z m3454 -1419 l0 -70 -70 0 -70 0 0 70 0 70 70
                    0 70 0 0 -70z m-630 -412 c0 -285 -4 -477 -10 -500 -6 -20 -24 -48 -41 -62
                    l-31 -26 -971 0 c-757 0 -977 3 -997 13 -13 7 -35 28 -47 46 l-23 34 0 478 0
                    479 1060 0 1060 0 0 -462z"/>
                    <path d="M1330 1255 l0 -75 785 0 785 0 0 75 0 75 -785 0 -785 0 0 -75z"/>
                    <path d="M1332 898 l3 -73 780 0 780 1 3 72 3 72 -786 0 -786 0 3 -72z"/>
                    </g>
                  </svg>
              </Tooltip>
            </a>
          )}
        </div>
      ),
    },
  ],[gereeniiMedeelel,loadingIndex,delgegdsenGeree])

  //#endregion

  //#region handlers
  function onChangeTurul(turul) {
    setTurul(turul)
    setGereeniiKhuudaslalt(a=>({...a,khuudasniiDugaar:1}))
  }

  function refreshData() {
    gereeniiMedeelelMutate();
    refTuukh.current?.refreshData()
  }

  function guilgeeKhiiya(data) {
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => ref.current.khadgalya()}>
        Хадгалах
      </Button>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <GuilgeeKhiikh
          data={data}
          ref={ref}
          token={token}
          baiguullagiinId={baiguullaga?._id}
          onFinish={refreshData}
        />
      ),
      footer,
    });
  }

  function khungulultKhiiya(data) {
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => ref.current.khadgalya()}>
        Хадгалах
      </Button>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <Khungulukh
          data={data}
          ref={ref}
          token={token}
          baiguullagiinId={baiguullaga?._id}
          onFinish={refreshData}
        />
      ),
      footer,
    });
  }
  //#endregion
  

  return (
    <Admin
      title="Гүйлгээний түүх"
      khuudasniiNer="guilgeeniiTuukh"
      className="p-0 md:p-4"
      onSearch={(search) => {
        if( loadingIndex !== 0)
          setLoadingIndex(0)
        setGereeniiKhuudaslalt((a) => ({ ...a, search,khuudasniiDugaar:1 }));
      }}
    >
      <Card className="col-span-12 p-5 cardgrid">
        <div className="w-full grid grid-cols-12 gap-4">
          {[
            {
              too: formatNumber(_.get(guilgeeniiToololt, "avlaga.0.dun") || 0),
              turul:'avlaga',
              utga: "Хуримтлагдсан авлага",
            },
            {
              too: formatNumber(_.get(guilgeeniiToololt, "uglug.0.dun") || 0),
              turul:'uglug',
              utga: "Илүү төлөлт",
            },
            {
              too: formatNumber(
                _.get(guilgeeniiToololt, "khugatsaaKhetersen.0.dun") || 0
              ),
              turul:'khugatsaaKhetersen',
              utga: "Цуцлагдсан гэрээний авлага",
            },
            {
              too: formatNumber(
                _.get(guilgeeniiToololt, "eneSardTulukh.0.dun") || 0
              ),
              turul:'eneSardTulukh',
              utga: "Төлөвлөлгөө / сар",
            },
            {
              too: formatNumber(
                _.get(guilgeeniiToololt, "eneSardTulsun.0.dun") || 0
              ),
              turul:'eneSardTulsun',
              utga: "Гүйцэтгэл / сар",
            },
            {
              too: formatNumber(
                _.get(guilgeeniiToololt, "khungulult.0.dun") || 0
              ),
              turul:'khungulult',
              utga: "Хөнгөлөлт / сар",
            },
          ].map((mur, index) => {
            return (
              <div
                key={`${index}toololt`}
                className="border-2 border-green-600 rounded-xl col-span-12 sm:col-span-12 lg:col-span-2 intro-y cursor-pointer zoom-in"
                onClick={()=>onChangeTurul(mur?.turul)}
              >
                <div className="h-full rounded-xl">
                  <div className="p-3 rounded-xl">
                    <div className="flex">
                      <div>
                        <div className="text-2xl text-green-600 font-bold">
                          {mur.too}
                        </div>
                        <div className="text-base text-gray-500">
                          {mur.utga}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <div className="text-green-600 text-2xl">
                          {mur.icon}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-row mt-5">
          <DatePicker.RangePicker picker="month" value={ognoo} onChange={v=>{
            setOgnoo(v)
            setLoadingIndex(0)
          }}/>
          <Button className='ml-auto' 
          style={{
            alignItems: "end",
            backgroundColor: "#209669",
            color: "#ffffff",
            marginTop: "20px",
            display: "flex",
          }}
          icon={<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
          width="575.000000pt" height="376.000000pt" viewBox="0 0 575.000000 376.000000"
          preserveAspectRatio="xMidYMid meet" className='fill-current text-white w-8 h-6 p-1'>

          <g transform="translate(0.000000,376.000000) scale(0.100000,-0.100000)"
          stroke="none">
          <path d="M715 3630 c-109 -22 -224 -88 -300 -172 -55 -62 -110 -172 -124 -252
          -15 -83 -15 -2529 0 -2612 17 -93 71 -196 142 -268 76 -76 154 -121 255 -146
          75 -19 133 -20 2123 -20 1990 0 2048 1 2121 19 110 28 174 65 254 145 73 74
          115 145 140 241 21 77 20 2596 -1 2674 -23 87 -64 159 -131 230 -65 69 -121
          106 -221 144 l-58 22 -2080 1 c-1144 1 -2098 -2 -2120 -6z m1145 -403 l0 -193
          55 -29 55 -30 55 30 55 29 0 193 0 193 1408 -2 1407 -3 51 -27 c73 -38 106
          -69 139 -130 l30 -53 3 -572 3 -573 -1033 0 -1033 0 -22 -39 c-12 -21 -45 -68
          -73 -102 l-51 -64 1105 -3 1106 -2 0 -613 c-1 -489 -4 -620 -14 -650 -32 -89
          -106 -159 -200 -190 -45 -16 -173 -17 -1438 -17 l-1388 0 -1 513 -1 512 -54
          49 -55 50 -54 -54 -55 -54 0 -508 0 -509 -562 3 c-553 3 -564 3 -610 25 -66
          30 -132 95 -159 156 l-24 52 -3 617 -3 618 267 2 267 3 -41 47 c-22 26 -55 72
          -74 102 l-33 55 -193 1 -193 0 3 563 3 562 23 50 c38 82 115 149 202 176 14 4
          274 8 578 8 l552 1 0 -193z"/>
          <path d="M1430 2889 c-79 -15 -188 -76 -254 -143 -288 -289 -157 -775 239
          -885 22 -6 98 -11 170 -11 l130 0 -228 -228 -227 -227 73 -73 c40 -39 77 -72
          82 -72 6 0 132 123 282 272 l273 273 273 -273 c150 -149 277 -272 282 -272 5
          0 42 33 82 72 l73 73 -227 227 -228 228 130 0 c72 0 148 5 170 11 234 65 395
          277 395 518 -1 284 -240 521 -525 521 -135 0 -268 -53 -367 -147 l-58 -56 -61
          57 c-131 121 -302 169 -479 135z m259 -238 c60 -31 104 -77 138 -141 28 -54
          28 -58 31 -254 l4 -198 -194 3 c-188 4 -195 5 -250 32 -181 89 -234 314 -112
          474 30 40 99 88 145 102 58 18 188 8 238 -18z m836 4 c63 -30 129 -103 154
          -168 58 -156 -8 -321 -157 -394 -55 -27 -62 -28 -249 -32 l-193 -3 0 179 c0
          197 9 247 58 318 30 44 106 99 156 115 50 15 185 6 231 -15z"/>
          <path d="M3474 976 c-38 -38 -44 -77 -19 -126 20 -38 43 -50 97 -50 100 0 143
          120 67 184 -46 39 -101 36 -145 -8z"/>
          <path d="M3811 996 c-58 -32 -69 -119 -22 -167 24 -23 38 -29 73 -29 52 0 85
          21 104 66 12 29 12 39 -2 74 -25 63 -95 88 -153 56z"/>
          <path d="M4110 981 c-50 -49 -52 -105 -6 -154 21 -22 34 -27 73 -27 56 0 85
          17 103 59 44 106 -90 202 -170 122z"/>
          <path d="M4438 993 c-32 -20 -48 -52 -48 -99 0 -84 110 -126 178 -69 99 83
          -20 236 -130 168z"/>
          </g>
          </svg>}>Хөнгөлөлт оруулах</Button>
        </div>
        <div className="overflow-auto hidden md:block mt-5">
          <Table
            scroll={{ y: "calc(100vh - 26rem)" }}
            size="small"
            bordered
            columns={columns}
            loading={!gereeniiMedeelel}
            dataSource={gereeniiMedeelel?.jagsaalt}
            rowKey={(a) => a._id}
            className="t-head"
            rowClassName={(record, index) =>
              index % 2 === 0
                ? "bg-white dark:bg-gray-600"
                : "bg-gray-200 dark:bg-gray-800"
            }
            pagination={{
              current: gereeniiMedeelel?.khuudasniiDugaar,
              pageSize: gereeniiMedeelel?.khuudasniiKhemjee,
              total: gereeniiMedeelel?.niitMur,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>{
                setLoadingIndex(0)
                setGereeniiKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                }))
              },
            }}
            expandable={{
              expandedRowRender: (mur) =>
                mur?._id === delgegdsenGeree && (
                  <GuilgeeniiTuukh
                    ref={refTuukh}
                    mur={mur}
                    token={token}
                    ognoo={ognoo}
                    data={mur}
                    refreshData={refreshData}
                  />
                ),
              expandedRowKeys: [delgegdsenGeree],
              expandedRowClassName: (a, index) =>
                index % 2 === 0
                  ? "bg-white dark:bg-gray-600"
                  : "bg-gray-200 dark:bg-gray-800",
              onExpand: (a, b) => setDelgegdsenGeree(a === true && b._id),
            }}
          />
        </div>
      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default guilgeeniiTuukh;
