import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useState, useMemo } from "react";
import { useAuth } from "services/auth";
import {
    Button,
    Card,
    DatePicker,
    Input,
    Popover,
    Space,
    Table,
    Radio,
    Modal,
    TreeSelect,
    Form,
    message,
    Tooltip,
    Drawer, Select, notification,
} from "antd";
import {
    StarOutlined,
    CameraOutlined,
    WalletOutlined,
    SettingOutlined,
    ExclamationCircleOutlined,
    MoreOutlined,
    CloseCircleOutlined,
    DollarCircleOutlined,
    PlusOutlined,
    CheckCircleOutlined,
    DownloadOutlined,
    FileExcelOutlined,
    DownOutlined,
    EyeOutlined,
    CloseOutlined,
    CaretDownOutlined
} from "@ant-design/icons";
import CardList from "components/cardList";
import UilchluulegchTile from "components/pageComponents/zogsool/UilchluulegchTile";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { useRef, useEffect } from "react";
import useOrder from "tools/function/useOrder";
import Aos from "aos";
import { useTranslation } from "react-i18next";
import useUilchluulegch from "../../../hooks/useUilchluulegch";
import useJagsaalt from "../../../hooks/useJagsaalt";
import { modal } from "../../../components/ant/Modal";
import Tulbur from "../../../components/pageComponents/zogsool/Tulbur";
import _ from "lodash";
import updateMethod from "../../../tools/function/crud/updateMethod";
import { excelTatajAvya } from "./index";
import useDansKhuulga from "../../../hooks/khuulga/useDansKhuulga";
import axios from "axios";
import{ aldaaBarigch, socket } from "services/uilchilgee";
import useSWR from "swr";
import uilchilgee from "services/uilchilgee";
import {t} from "i18next";

const usguud = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'Ө', 'П', 'Р', 'С', 'Т', 'У', 'Ү', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ь', 'Ы', 'Э', 'Ю', 'Я',];

function generateChild(mur) {
    if (mur?.length > 0)
        return mur?.map((a) => ({
            value: !!a?.ner ? a.ner : a.cameraIP,
            title: !!a?.ner ? (
                a.ner + (a?.turul ? (' / '+a?.turul) : '')
            ) : (
                <b key={a.cameraIP} className="text-green-400 hover:text-green-800">
                    Камер-{a.cameraIP}
                </b>
            ),
            children: generateChild(!!a?.khaalga ? a.khaalga : a.camera),
            disabled: false,
            disableCheckbox: true,
            selectable: !a?.ner,
            checkable: !a?.ner
        }));
    return [];
}

/*const TreeComponent = ()=>{
    const { TreeNode } = Tree;

    const TreeComponent = ({ hierarchy }) => {
        const renderTreeNodes = data =>
            data.map(item => {
                if (item.children) {
                    return (
                        <TreeNode title={item.title} key={item.key} dataRef={item}>
                            {renderTreeNodes(item.children)}
                        </TreeNode>
                    )
                }
                return <TreeNode key={item.key} {...item} />
            })

        return (
            <Tree>
                {renderTreeNodes(hierarchy)}
            </Tree>
        )
    }
}*/

/**
 * Эхний байдлаар зөвхөн 1 зогсоол дээр төлбөр тооцхоор шийдлээ
 * дотороо зогсоолтой тохиолдолд өөрчилнө
 * */

function camera({token}) {
    const { t, i18n } = useTranslation();
    const { baiguullaga, ajiltan, barilgiinId } = useAuth();
    const [ognoo, setOgnoo] = useState([
        moment().startOf("day"),
        moment().endOf("day"),
    ]);
    const [turul, setTurul] = useState(undefined);
    const [songosonMashin, setSongosonMashin] = useState(undefined);
    const tulburRef = React.useRef(null);
    // const { order, onChangeTable } = useOrder({"tuukh.0.tsagiinTuukh.0.garsanTsag":-1});
    const { order, onChangeTable, setOrder } = useOrder({ "tuukh.tsagiinTuukh.garsanTsag": -1 });
    const [modalOpen, setModalOpen] = useState({
        bool: false,
        item: null,
        type: "",
    });
    const [value, setValue] = useState(null);
    const [camerVal, setCamerVal] = useState([null,null]);
    const [cameraData, setCameraData] = useState(null);
    const [cameraKharakh, setCamerKharakh] = useState(false);
    const [guilgeeKharakh, setGuilgeeKharakh] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [orlogo, setOrlogo] = useState([]);
    const [khelber, setKhelber] = useState(null);
    const [form] = Form.useForm();

    const que = useMemo(() => {
        return {
            baiguullagiinId: baiguullaga?._id,
            "khaalga.ajiltnuud.id": ajiltan?._id,
        };
    }, [baiguullaga?._id, ajiltan]);
    const { jagsaalt } = useJagsaalt("/zogsoolJagsaalt", que);

    const query = useMemo(() => {
        let result = {
            createdAt: {
                $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
                $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
            }
        }
        if(!!khelber){
            result = {
                "tuukh.tulburTulsunKhelber": !!khelber&&khelber==='card' ? { $all: ["khaan", "tdb","khas","golomt","kapitron","tur"] } : khelber, ...result
            }
        }

        return result
    }, [ognoo, khelber]);
    const orlogoQuery = useMemo(() => {
        if (jagsaalt?.length > 0){
            //зогсоолын id.р хайдаг болгох
            return {
                baiguullagiinId: baiguullaga?._id,
                // barilgiinId: barilgiinId,
                zogsooliinId: jagsaalt[0]?._id,
                ekhlekhOgnoo: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
                duusakhOgnoo: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
            };
        }
    }, [ognoo, jagsaalt]);

    const dansQuery = useMemo(() => {
        return{"amount":{"$gt":0}}
    }, [ognoo]);

    useEffect(() => {
        Aos.init({ once: true });
    });

    useEffect(()=>{
        uilchilgee(token)
            .post("/zogsoolUilchiluulegchidiinDunAvay", orlogoQuery)
            .then((a) => {
                // console.log('a.data-------------- ', a.data);
                setOrlogo(a.data);
            })
            .catch(aldaaBarigch);
    },[orlogoQuery]);

    useEffect(() => {
        const aa = generateChild(jagsaalt);
        setCameraData(aa);
    }, [jagsaalt]);
    useEffect(() => {
        socket().on(`zogsool`, (zogsool) => {
            onRefresh();
            console.log(zogsool)
        });
        return () => {
            socket().off(`zogsool`);
        };
    }, []);

    const {
        uilchluulegchGaralt,
        setUilchluulegchKhuudaslalt,
        uilchluulegchMutate,
        isValidating,
    } = useUilchluulegch(token, baiguullaga?._id, query, order);

    const dasniiMedeelel = {
        baiguullagiinId:baiguullaga?._id,
        bank: "khanbank",
        barilgiinId:barilgiinId,
        corporateAshiglakhEsekh: true,
        corporateNevtrekhNer: "0CAhOZ85wlmRzrPAkBycQFeTBnewDX7O",
        corporateNuutsUg: "Rv1eLukuzQirNgD3",
        createdAt: "2022-01-27T06:27:31.111Z",
        dansniiNer: "Их Наяд Плаза ХХК",
        dugaar: "5129057717",
        updatedAt: "2022-12-29T03:50:29.941Z",
        valyut: "MNT",
        __v: 0,
        _id: "61f23b53d75a1b62d86f2987"
    };
    const {
        dansniiKhuulgaGaralt,
        setDansniiKhuulgaKhuudaslalt,
        dansniiKhuulgaMutate,
    } = useDansKhuulga(
        token,
        baiguullaga?._id,
        dasniiMedeelel,
        [
            moment().subtract(30, "days").format("YYYY-MM-DD 00:00:00"),
            moment().format("YYYY-MM-DD 23:59:59"),
        ],
        { createdAt: -1 },
        dansQuery
    );

    function onRefresh() {
        uilchluulegchMutate();
        dansniiKhuulgaMutate();
    }
    const minToHour = (m) => {
        let res ;
        if(m<60)
            res = (m+' мин');
        else {
            const h = Math.floor(m / 60);
            const min = m % 60;
            res = (h+' цаг '+(min&&min+' мин'))
        }
        return res;
    };
    function tulburTulyu(data, uilchluugchiinId) {
        // console.log('----------', data, ' - ',uilchluugchiinId);
        modal({
            title: (
                <div className="flex w-full flex-row justify-between">
                    <div>{t("Тооцоо хийх")}</div>
                    <div className="flex items-center">
                        {data?.ovog?.charAt(0)}.{data?.ner}
                        <div
                            className="ml-5 text-xl hover:text-red-400"
                            onClick={() => tulburRef.current.khaaya()}>
                            <CloseCircleOutlined />
                        </div>
                    </div>
                </div>
            ),
            content: (
                <Tulbur
                    ref={tulburRef}
                    data={_.cloneDeep(data)}
                    token={token}
                    baiguullaga={baiguullaga}
                    barilgiinId={barilgiinId}
                    ajiltan={ajiltan}
                    uilchluugchiinId={uilchluugchiinId}
                    onRefresh={onRefresh}
                />
            ),
            footer: false,
        });
    }
    const columns = useMemo(() => {
        const col = [
            {
                title: "№",
                align: "center",
                dataIndex: "dugaar",
                width: "2rem",
                render: (text, record, index) =>
                    (uilchluulegchGaralt?.khuudasniiDugaar || 0) *
                    (uilchluulegchGaralt?.khuudasniiKhemjee || 0) -
                    (uilchluulegchGaralt?.khuudasniiKhemjee || 0) +
                    index +
                    1,
            },
            {
                title: t("Дугаар"),
                align: "center",
                width: "10rem",
                dataIndex: "mashiniiDugaar",
                showSorterTooltip: false,
                sorter: () => 0,
            },
        ];
        return [
            ...col,
            {
                title: t("Орсон"),
                align: "center",
                width: "10rem",
                dataIndex: "tuukh.tsagiinTuukh.orsonTsag",
                showSorterTooltip: false,
                sorter: () => 0,
                render(v, p) {
                    const d = p.tuukh[0]?.tsagiinTuukh[0]?.orsonTsag;
                    return d && moment(d).format("MM-DD HH:mm");
                },
            },
            {
                title: t("Гарсан"),
                align: "center",
                width: "10rem",
                dataIndex: "tuukh.tsagiinTuukh.garsanTsag",
                showSorterTooltip: false,
                sorter: () => 0,
                render(v, p) {
                    const d = p.tuukh[0]?.tsagiinTuukh[0]?.garsanTsag;
                    return d && moment(d).format("MM-DD HH:mm");
                },
            },
            {
                title: t("Хугацаа/мин"),
                align: "center",
                width: "10rem",
                showSorterTooltip: false,
                sorter: () => 0,
                dataIndex: "tuukh",
                render(v) {
                    // const d1 = moment(v[0]?.tsagiinTuukh[0]?.orsonTsag);
                    const d2 = tsagTootsoolur(v[0]?.tsagiinTuukh[0]?.orsonTsag);
                    return !!v[0]?.tsagiinTuukh[0]?.garsanTsag ? <div className="py-1 px-3 rounded bg-green-200">{minToHour(v[0].niitKhugatsaa)}</div> :
                        <div className="py-1 px-3 rounded bg-blue-200">{d2.hours.length < 2 ? ('0'+d2.hours) : d2.hours} : {d2.minutes.length < 2 ? ('0'+d2.minutes) : d2.minutes}</div>;
                },
            },
            {
                title: t("Төрөл"),
                align: "center",
                width: "10rem",
                dataIndex: "turul",
                showSorterTooltip: false,
                sorter: () => 0,
            },
            {
                title: t("Дүн"),
                align: "right",
                width: "10rem",
                showSorterTooltip: false,
                sorter: () => 0,
                dataIndex: "tuukh.tulukhDun",
                render(v, p) {
                    // console.log(p.tuukh[0]?.tulukhDun, '======')
                    return p && formatNumber(p.tuukh[0]?.tulukhDun, 0);
                },
                summary: true,
            },
            {
                title: (
                    <Popover
                        placement="bottom"
                        content={
                            <div className="space-y-2">
                                <div
                                    onClick={() => setKhelber("belen")}
                                    className={`flex py-[2px] px-5 cursor-pointer relative hover:bg-blue-600 font-medium hover:bg-opacity-20 rounded-md border ${
                                        khelber === "belen" &&
                                        "bg-blue-600 border-blue-600 bg-opacity-20"
                                    }`}>
                                    Бэлэн
                                    {khelber === "belen" && (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setKhelber(undefined);
                                            }}
                                            className="text-xl hover:text-red-400 hover:scale-105 right-0 translate-x-1/2 bg-white rounded-full -top-1 flex">
                                            <CloseCircleOutlined />
                                        </div>
                                    )}
                                </div>
                                <div
                                    onClick={() => setKhelber("card")}
                                    className={`flex py-[2px] px-5 cursor-pointer relative hover:bg-green-600 font-medium hover:bg-opacity-20 items-center justify-center rounded-md border ${
                                        khelber === "VIP" &&
                                        "border-green-600 bg-green-600 bg-opacity-20"
                                    }`}>
                                    Карт
                                    {khelber === "card" && (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setKhelber(undefined);
                                            }}
                                            className="text-xl hover:text-red-400 hover:scale-105 right-0 translate-x-1/2 bg-red rounded-full -top-1 flex">
                                            <CloseCircleOutlined />
                                        </div>
                                    )}
                                </div>
                                <div
                                    onClick={() => setKhelber("khariltsakh")}
                                    className={`flex py-[2px] px-5 cursor-pointer relative hover:bg-green-600 font-medium hover:bg-opacity-20 items-center justify-center rounded-md border ${
                                        khelber === "VIP" &&
                                        "border-green-600 bg-green-600 bg-opacity-20"
                                    }`}>
                                    Харилцах
                                    {khelber === "khariltsakh" && (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setKhelber(undefined);
                                            }}
                                            className="absolute text-xl hover:text-red-400 hover:scale-105 right-0 translate-x-1/2 bg-white rounded-full -top-1 flex">
                                            <CloseCircleOutlined />
                                        </div>
                                    )}
                                </div>
                            </div>
                        }>
                        <div
                            className={`flex gap-3  cursor-pointer items-center justify-center `}>
                            Хэлбэр <CaretDownOutlined className={`text-lg`} />
                        </div>
                    </Popover>),
                align: "center",
                dataIndex: "tuukh",
                width: "7rem",
                showSorterTooltip: false,
                render: (v) => {
                    let r = null;
                    switch(v[0]?.tulburTulsunKhelber) {
                        case 'belen':r = 'Бэлэн';break;
                        case 'khariltsakh':r='Харилцах';break;
                        case 'khaan':r='Хаан';break;
                        case 'khas':r='Хас';break;
                        case 'tur':r='Төр';break;
                        case 'golomt':r='Голомт';break;
                        case 'tdb':r='ХХБ';break;
                        default: break;
                    }
                    return r && <div>{r}</div>;
                },
            },
            {
                title: t("Төлөв"),
                align: "center",
                width: "10rem",
                showSorterTooltip: false,
                sorter: () => 0,
                dataIndex: "tuukh",
                render(v, parent) {
                    return (v[0]?.tuluv === 0 && !!v[0]?.tulukhDun) ? (
                        <Popover
                            placement="bottom"
                            trigger="hover"
                            content={() => (
                                <div className="flex w-24 flex-col space-y-2">
                                    <a
                                        className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                                        onClick={() => {
                                            !!v[0]?.tulukhDun ?
                                                tulburTulyu(v[0], parent._id) :
                                                notification.warn({ message: t("Дүн бодогдоогүй байна.") });
                                        }}>
                                        <WalletOutlined style={{ fontSize: "18px" }} />
                                        <label>{t("Төлөх")}</label>
                                    </a>
                                    <a
                                        className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                                        onClick={() =>
                                            setModalOpen({ bool: true, item: parent, type: "unegui" })
                                        }>
                                        <StarOutlined style={{ fontSize: "18px" }} />
                                        <label>{t("Үнэгүй")}</label>
                                    </a>
                                </div>
                            )}>
                            <Button
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "#FF8505",
                                }}
                                size="small">
                                <div className="flex items-center  justify-center space-x-2 text-white">
                                    <div className="flex items-center justify-center">
                                        <DollarCircleOutlined />
                                    </div>
                                    <div className="flex items-center justify-center">
                                        {t("Төлбөр")}
                                    </div>
                                </div>
                            </Button>
                        </Popover>
                    ) :  (
                        (v[0]?.tuluv === 0 && !v[0]?.tsagiinTuukh[0]?.garsanTsag) ?
                            <div className="mx-auto flex w-max cursor-pointer items-center justify-center space-x-2 rounded bg-blue-500 px-3 text-white">
                                <div className="flex items-center justify-center">Идэвтхэй</div>
                            </div>
                            :
                            (v[0]?.tuluv === 1 ?
                                    <div className="mx-auto flex w-max items-center bg-lime-500 rounded justify-center space-x-2 text-white px-3">
                                        <div className="flex items-center justify-center">
                                            {t("Төлөгдсөн")}
                                        </div>
                                    </div>
                                    :
                                    <div className="mx-auto flex w-max cursor-pointer items-center justify-center space-x-2 rounded bg-gray-500 px-3 text-white">
                                        <div className="flex items-center justify-center">
                                            {t("Үнэгүй")}
                                        </div>
                                    </div>
                            )
                    ) /*v[0]?.ebarimtAvsanEsekh ? (
                        <div className="mx-auto flex w-max items-center bg-lime-500 rounded justify-center space-x-2 text-white px-3">
                            <div className="flex items-center justify-center">
                                <CheckCircleOutlined />
                            </div>
                            <div className="flex items-center justify-center">
                                {t("Төлөгдсөн")}
                            </div>
                        </div>
                    ) : (
            <Button
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#253985",
              }}
              size="small"
              onClick={() => tulburTulyu(v[0], parent._id)}>
              <div className="flex items-center  justify-center space-x-2 text-white ">
                <div className="flex items-center justify-center">
                  <PaperClipOutlined />
                </div>
                <div className="flex items-center justify-center">
                  {t("И-Баримт")}
                </div>
              </div>
            </Button>
          );*/
                },
            },
            {
                title: t("Шалтгаан"),
                align: "center",
                dataIndex: "tuukh",
                width: "7rem",
                showSorterTooltip: false,
                render: (v, parent) => {
                    return v && <Tooltip
                        placement="top"
                        title={v[0]?.tuluv === -1 ? v[0]?.uneguiGarsan : parent.zurchil}>
                        <div className="line-clamp-2">{v[0]?.tuluv === -1 ? v[0]?.uneguiGarsan : (!!v[0]?.tsagiinTuukh[0]?.garsanTsag  && v[0]?.niitKhugatsaa <= 30) ? '30 мин' : parent.zurchil}</div>
                    </Tooltip>;
                },
            },
            {
                title: () => <SettingOutlined />,
                width: "2rem",
                align: "center",
                render: (data) => (
                    <div className="flex flex-row">
                        <Popover
                            placement="bottom"
                            trigger="hover"
                            content={() => (
                                <div className="space-y-2">
                                    <a
                                        className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                                        onClick={() =>
                                            setModalOpen({ bool: true, item: data, type: "zurchil" })
                                        }>
                                        <ExclamationCircleOutlined
                                            style={{ fontSize: "18px", marginRight: "3px" }}
                                        />
                                        <div>{t("Зөрчил нэмэх")}</div>
                                    </a>
                                </div>
                            )}>
                            <a className=" flex items-center justify-center  hover:scale-150 dark:hover:bg-gray-700">
                                <MoreOutlined style={{ fontSize: "18px" }} />
                            </a>
                        </Popover>
                    </div>
                ),
            },
        ];
    }, [turul, i18n.language, ajiltan, baiguullaga, barilgiinId]);

    const baganuud = [
        {
            title: "№",
            width: "2.5rem",
            align: "center",
            dataIndex: "description",
            render: (v,index, key) => (key + 1)
        },
        {
            title: "Огноо",
            width: "6rem",
            align: "center",
            dataIndex: "createdAt",
            render: (data) => {
                return moment(data).format("MM/DD HH:mm");
            },
        },
        {
            title: "Утга",
            width: "10rem",
            align: "center",
            dataIndex: "description",
            render: (v) => {
                return <Tooltip
                    placement="top"
                    title={v}>
                    <div className="text-left truncate">{v}</div>
                </Tooltip>;
            },
        },
        {
            title: "Дүн",
            width: "4rem",
            dataIndex: "amount",
            align: "center",
            render(v) {
                return v && <div className="text-right">{formatNumber(v, 0)} ₮</div>;
            },
        },
    ];
    const onChange = (e) => {
        setValue(e.target.value);
    };
    const cameraChange = (e, type) => {
        if (type===1)
            setCamerVal([e,camerVal[1]]);
        else
            setCamerVal([camerVal[0],e]);
    };
    const khadgalakh = () => {
        let body = modalOpen.item;
        if (modalOpen.type === "zurchil") {
            body.zurchil = value;
            body.tuukh[0].tuluv = -2;
        } else if (modalOpen.type==="dugaarBurtgekh") {
            form.submit();
        } else  {
            body.tuukh[0].uneguiGarsan = value;
            body.tuukh[0].tuluv = -1;
        }
        if(modalOpen.type!=="dugaarBurtgekh"){
            updateMethod("zogsoolUilchluulegch", token, body).then(({ data }) => {
                if (data === "Amjilttai") {
                    message.success(t("Амжилттай хадгаллаа"));
                    onRefresh();
                }
            });
            setModalOpen({ bool: false, item: null, type: "" });
            setValue(null);
        }
    };
    const exlCol = () => {
        const aa = columns;
        aa.splice(columns.length - 2, 2, {
            title: t("Төлөв"),
            sorter: () => 0,
            dataIndex: "tuukh",
            render(v) {
                return v[0]?.tuluv === 0 ? (
                    <div>Төлөөгүй</div>
                ) : v[0]?.tuluv < 0 ? (
                    <div>Үнэгүй</div>
                ) : v[0]?.ebarimtAvsanEsekh ? (
                    <div>Төлөгдсөн</div>
                ) : (
                    <div>И-Баримт</div>
                );
            },
        });
        return aa;
    };
    const khaalgaNeey = (ip) => {
        axios.get('http://localhost:5000/api/neeye/'+ip+'').then(function (response) {
            if(!!response)
                console.log('/api/neeye', response);
        }).catch(function (error) {
            console.log('ERROR: /api/neeye', error);
        })
    };
    const keyPadHandler = (v)=>{
        const val = form.getFieldValue('mashiniiDugaar');
        if(!val || val.length < 7)
            form.setFieldValue('mashiniiDugaar', val?val+v:v);
        // console.log(v,' - - ', val)
    };
    const dugaarBurtgekh = ()=>{
        const body = form.getFieldsValue();
        // console.log('99999999', body);
        uilchilgee(token)
            .post("/zogsoolSdkService", body)
            .then(({status}) => {
                if (status === 200) {
                    notification.success({ message: t("Амжилттай бүртгэгдлээ") });
                    setModalOpen({ bool: false, item: null, type: "" });
                    onRefresh();
                }
            }).catch(aldaaBarigch);
    }
    const tsagTootsoolur = (v) => {
        const odooginTsag =
            Number(moment(new Date()).format("HH")) * 60 * 60 +
            Number(moment(new Date()).format("mm")) * 60 +
            Number(moment(new Date()).format("ss"));
        const ekhlesenTsag =
            Number(moment(v).format("HH")) * 60 * 60 +
            Number(moment(v).format("mm")) * 60 +
            Number(moment(v).format("ss"));
        const difference = odooginTsag - ekhlesenTsag;
        const tsag = Math.floor(difference / 60 / 60);
        const minut = Math.floor((difference - tsag * 60 * 60) / 60);
        // const second = Math.floor(difference - tsag * 60 * 60 - minut * 60);
        return {
            hours: tsag.toString(),
            minutes: minut.toString(),
        };
    };

    return (
        <Admin
            title="Камер"
            tsonkhniiId={"64474e3e28c37d7cdda15d01"}
            khuudasniiNer="Camera"
            fixedZagvarNeegdsenEsekh={guilgeeKharakh}
            setTurulZagvar={setGuilgeeKharakh}
            className="relative p-2 sm:p-4"
            onSearch={(search) =>
                setUilchluulegchKhuudaslalt((a) => ({
                    ...a,
                    search,
                    khuudasniiDugaar: 1,
                }))
            }
            loading={isValidating}>
            {jagsaalt?.length > 0 ? (
                <div className="col-span-12">
                    <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
                        <div
                            onClick={() => {
                                setCamerKharakh(false);
                            }}
                            className={`w-full ${
                                cameraKharakh === 1 &&
                                "fixed top-0 right-0 z-50 flex h-screen w-screen items-center justify-center rounded-md bg-black bg-opacity-80 p-2 md:py-[10%]"
                            }`}>
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCamerKharakh(1);
                                }}
                                className="flex w-full items-center justify-center ">
                                <img
                                    src={`https://i.pinimg.com/originals/a4/4e/49/a44e4947dc1057f222dbe705b04570a3.jpg`}
                                    className={`object-cover  ${
                                        cameraKharakh === 1
                                            ? "w-full  sm:h-[80vh] sm:w-[80%]"
                                            : "w-full  sm:h-[250px]"
                                    }`}
                                />
                            </div>
                            {cameraKharakh === 1 && (
                                <div className="absolute top-5 right-5 text-3xl text-white">
                                    <CloseOutlined
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCamerKharakh(false);
                                        }}
                                    />
                                </div>
                            )}
                            <div
                                className={`mt-3 flex flex-col justify-between gap-3 sm:flex-row ${
                                    cameraKharakh === 1 && "absolute bottom-5 w-40"
                                }`}>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={(e) => {
                                            khaalgaNeey(camerVal[0]);
                                        }}
                                        className="w-full sm:w-auto"
                                        type="primary">
                                        Нээх
                                    </Button>
                                    {/*<Button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="w-full sm:w-auto"
                    type="primary">
                    Хаах
                  </Button>*/}
                                </div>
                                <TreeSelect
                                    /*onClick={(e) => {
                                        e.stopPropagation();
                                    }}*/
                                    placement={cameraKharakh === 1 ? "topRight" : "bottomLeft"}
                                    showSearch
                                    style={{
                                        backgroundColor: "#10B981",
                                        borderColor: "#10B981",
                                    }}
                                    value={camerVal[0]}
                                    dropdownStyle={{
                                        maxHeight: 600,
                                        minWidth: 280,
                                        overflow: "auto",
                                    }}
                                    placeholder="Камер сонгох"
                                    allowClear
                                    treeDefaultExpandAll
                                    onChange={(e)=>cameraChange(e, 1)}
                                    treeData={cameraData}
                                />
                            </div>
                        </div>
                        <div
                            onClick={() => {
                                setCamerKharakh(false);
                            }}
                            className={`w-full ${
                                cameraKharakh === 2 &&
                                "fixed top-0 right-0 z-50 flex h-screen w-screen items-center justify-center rounded-md bg-black bg-opacity-80 p-2"
                            }`}>
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCamerKharakh(2);
                                }}
                                className="flex w-full items-center justify-center ">
                                <img
                                    src={`https://i.pinimg.com/originals/a4/4e/49/a44e4947dc1057f222dbe705b04570a3.jpg`}
                                    className={`object-cover  ${
                                        cameraKharakh === 2
                                            ? "w-full  sm:h-[80vh] sm:w-[80%]"
                                            : "w-full  sm:h-[250px]"
                                    }`}
                                />
                            </div>
                            {cameraKharakh === 2 && (
                                <div className="absolute top-5 right-5 text-3xl text-white">
                                    <CloseOutlined
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCamerKharakh(false);
                                        }}
                                    />
                                </div>
                            )}
                            <div
                                className={`mt-3 flex flex-col justify-between gap-3 sm:flex-row ${
                                    cameraKharakh === 2 && "absolute bottom-5 w-40"
                                }`}>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={(e) => {
                                            khaalgaNeey(camerVal[1]);
                                        }}
                                        className="w-full sm:w-auto"
                                        type="primary">
                                        Нээх
                                    </Button>
                                    {/*<Button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="w-full sm:w-auto"
                    type="primary">
                    Хаах
                  </Button>*/}
                                </div>
                                <TreeSelect
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    placement={cameraKharakh === 2 ? "topRight" : "bottomRight"}
                                    showSearch
                                    style={{
                                        backgroundColor: "#10B981",
                                        borderColor: "#10B981",
                                    }}
                                    value={camerVal[1]}
                                    dropdownStyle={{
                                        maxHeight: 600,
                                        minWidth: 280,
                                        overflow: "auto",
                                    }}
                                    placeholder="Камер сонгох"
                                    allowClear
                                    treeDefaultExpandAll
                                    onChange={(e)=>cameraChange(e, 2)}
                                    treeData={cameraData}
                                />
                            </div>
                        </div>
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            className={`fixed right-[8%] top-1/2 z-50 w-[84%] -translate-y-1/2 rounded-lg border bg-white p-5 shadow-xl transition-all xl:relative xl:right-0 xl:z-0 xl:w-auto xl:border-none xl:bg-transparent xl:p-0 xl:shadow-none ${
                                guilgeeKharakh === false ? "scale-0 xl:scale-100" : "scale-100"
                            }`}>
                            <div className="text-base font-bold">Сүүлийн гүйлгээ</div>
                            <div className="absolute top-3 right-3 text-3xl xl:hidden">
                                <CloseCircleOutlined
                                    onClick={() => setGuilgeeKharakh(false)}
                                    className="text-red-400"
                                />
                            </div>
                            <Table
                                pagination={false}
                                className="mt-3 overflow-auto"
                                scroll={{ y: "calc(100vh / 4.5)" }}
                                size="small"
                                dataSource={dansniiKhuulgaGaralt?.jagsaalt}
                                columns={baganuud}
                            />
                        </div>
                    </div>
                    <Card className="col-span-12 mt-2">
                        <div className="mb-5 xl:hidden">
                            <Button
                                style={{ width: "100%" }}
                                icon={<EyeOutlined />}
                                type="primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setGuilgeeKharakh(!guilgeeKharakh);
                                }}>
                                Гүйлгээ харах
                            </Button>
                        </div>
                        <div className="flex flex-col gap-2 md:flex-row">
                            <div
                                data-aos="fade-right"
                                data-aos-duration="1000"
                                className="flex w-full flex-col lg:flex-row"
                                data-aos-delay="100">
                                <DatePicker.RangePicker
                                    inputReadOnly
                                    className="w-full md:w-auto"
                                    size="middle"
                                    value={ognoo}
                                    onChange={setOgnoo}
                                />
                                <div className="ml-5 flex space-x-2 p-1 pt-2 text-base font-medium">
                                    {t("Бүртгэгдсэн орлого")} :{" "}
                                    {
                                        formatNumber(
                                            !!orlogo[0]?.niitDun ? orlogo[0].niitDun : 0, 0
                                        )
                                    }
                                    ₮
                                </div>
                                <div className="ml-5 flex space-x-2 p-1 pt-2 text-base font-medium">
                                    {t("Зогсоолын орлого")} :{" "}
                                    {
                                        formatNumber(
                                            !!orlogo[0]?.dun ? orlogo[0].dun : 0, 0
                                        )
                                    }
                                    ₮
                                </div>
                            </div>
                            <div
                                className="mb-5 flex w-full justify-between sm:justify-end md:ml-auto md:mb-0 lg:w-auto"
                                data-aos="fade-left"
                                data-aos-duration="1000"
                                data-aos-delay="300">
                                <Button
                                    className="mr-3 w-32 sm:w-auto"
                                    icon={<PlusOutlined />}
                                    onClick={() => setModalOpen({bool: true, item: null, type:'dugaarBurtgekh'})}
                                    type="primary">
                                    Машин бүртгэх
                                </Button>
                                <Popover
                                    content={() => (
                                        <div className="flex w-32 flex-col">
                                            <a
                                                className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700 "
                                                onClick={() => {
                                                    excelTatajAvya(
                                                        token,
                                                        "zogsoolUilchluulegch",
                                                        uilchluulegchGaralt.niitMur,
                                                        exlCol(),
                                                        query,
                                                        order,
                                                        "Зогсоол"
                                                    );
                                                }}>
                                                <DownloadOutlined style={{ fontSize: "18px" }} />
                                                <label>{t("Татах")}</label>
                                            </a>
                                        </div>
                                    )}
                                    style={{ padding: 0 }}
                                    placement="bottom"
                                    trigger="click">
                                    <Button
                                        type="primary"
                                        className="mr-3 w-32 sm:w-auto"
                                        icon={<FileExcelOutlined />}>
                                        <span>Excel</span>
                                        <DownOutlined width={5} />
                                    </Button>
                                </Popover>
                                <Button
                                    className="w-32 sm:w-auto"
                                    icon={<CameraOutlined />}
                                    onClick={() => setDrawerOpen(true)}
                                    type="primary">
                                    Камер
                                </Button>
                                <Drawer
                                    width={"100vw"}
                                    title={t("Камер")}
                                    placement="right"
                                    onClose={() => setDrawerOpen(false)}
                                    visible={drawerOpen}>
                                    {drawerOpen && (
                                        <Card className="col-span-12 row-span-full lg:col-span-4 lg:col-start-9">
                                            <div className="w-[500px]">
                                                <div className="flex aspect-square items-center justify-center border 2xl:aspect-[3/2]">
                                                    <p>Camera1</p>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-2">
                                                    <div className="aspect-square border">
                                                        <p>Camera2</p>
                                                    </div>
                                                    <div className="aspect-square border">
                                                        <p>Camera3</p>
                                                    </div>
                                                    <div className="aspect-square border">
                                                        <p>Camera4</p>
                                                    </div>
                                                    <div className="aspect-square border">
                                                        <p>Camera5</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    )}
                                </Drawer>
                            </div>
                        </div>
                        <div
                            data-aos="fade-left"
                            data-aos-duration="1000"
                            data-aos-delay="300"
                            data-aos-anchor-placement="top-bottom">
                            <Table
                                className="mt-8 hidden cameraTable overflow-auto md:block"
                                tableLayout="auto"
                                loading={!uilchluulegchGaralt}
                                dataSource={uilchluulegchGaralt?.jagsaalt}
                                scroll={{ y: "calc(100vh - 39.5rem)" }}
                                size="small"
                                bordered
                                rowKey={(row) => row._id}
                                columns={columns}
                                onChange={onChangeTable}
                                rowClassName={(record, index) =>{
                                    const d = record.tuukh[0];
                                    if(d.tuluv===0&&d?.tulukhDun)
                                        return "green";
                                }}
                                pagination={{
                                    current: uilchluulegchGaralt?.khuudasniiDugaar,
                                    pageSize: uilchluulegchGaralt?.khuudasniiKhemjee,
                                    total: uilchluulegchGaralt?.niitMur,
                                    showSizeChanger: true,
                                    onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                                        setUilchluulegchKhuudaslalt((kh) => ({
                                            ...kh,
                                            khuudasniiDugaar,
                                            khuudasniiKhemjee,
                                        })),
                                }}
                            />
                            <CardList
                                cardListTuluv={"utas"}
                                keyValue="uilchluulegch"
                                className="block overflow-auto md:hidden"
                                jagsaalt={uilchluulegchGaralt?.jagsaalt}
                                Component={UilchluulegchTile}
                            />
                        </div>
                    </Card>
                    <Modal
                        title={
                            modalOpen.type !== "zurchil" ?
                                modalOpen.type !== "dugaarBurtgekh" ?
                                    "Үнэгүй үйлчлүүлэгчийн төрөл сонгох" : "Машин бүртгэх"
                                : "Зөрчил оруулах"
                        }
                        open={modalOpen.bool}
                        onCancel={() => setModalOpen({ bool: false, item: null, type: "" })}
                        footer={[
                            <Button
                                key="back"
                                onClick={() =>
                                    setModalOpen({ bool: false, item: null, type: "" })
                                }>
                                Хаах
                            </Button>,
                            <Button type="primary" onClick={khadgalakh}>
                                Хадгалах
                            </Button>,
                        ]}>
                        <Space direction="vertical" className="w-full">
                            {
                                modalOpen.type!=='dugaarBurtgekh' ?
                                    <>
                                        <Radio.Group onChange={onChange} value={value}>
                                            {modalOpen.type !== "zurchil" ? (
                                                <Space direction="vertical">
                                                    <Radio value="Цагдаа">Цагдаа</Radio>
                                                    <Radio value="Гал">Гал</Radio>
                                                    <Radio value="Эмнэлэг">Эмнэлэг</Radio>
                                                    <Radio value="Онцгой">Онцгой</Radio>
                                                    <Radio value="Борлуулалтын машин">Борлуулалтын машин</Radio>
                                                    <Radio value="Хөгжлийн бэрхшээлтэй иргэн">
                                                        Хөгжлийн бэрхшээлтэй иргэн
                                                    </Radio>
                                                    <Radio value="Хогны машин">Хогны машин</Radio>
                                                </Space>
                                            ) : (
                                                <Space direction="vertical">
                                                    <Radio value="Журам зөрчсөн">Журам зөрчсөн</Radio>
                                                    <Radio value="Зугтаасан">Зугтаасан</Radio>
                                                </Space>
                                            )}
                                        </Radio.Group>
                                        <div className="flex w-full items-center">
                                            <label>Бусад</label>
                                            <Input onChange={onChange} className="ml-[10px] w-full" />
                                        </div>
                                    </>
                                    :
                                    <>
                                        <Form
                                            form={form}
                                            className="flex w-full"
                                            onFinish={dugaarBurtgekh}
                                        >
                                            <Form.Item
                                                label="Дугаар"
                                                name="mashiniiDugaar"
                                                className="w-2/5"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: t("Машины дугаар бүртгэнэ үү!"),
                                                    },
                                                    {
                                                        required: form.getFieldValue("mashiniiDugaar")?.length > 0 && true,
                                                        min: 7,
                                                        max: 7,
                                                        pattern: new RegExp("[0-9]{4}[А-Я|а-я|ө|Ө|ү|Ү]{3}"),
                                                        message: "Машины дугаар 4 тоо 3 үсэг байх ёстой",
                                                    }
                                                ]}
                                            >
                                                <Input maxLength={7} placeholder="1234УБА" className="ml-[10px]"/>
                                            </Form.Item>
                                            <Form.Item
                                                name="CAMERA_IP"
                                                className="w-2/5"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Камер сонгоно уу.',
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    className=""
                                                    placeholder="Камер IP"
                                                > {
                                                    cameraData[0].children.map(cam=>(
                                                        <Select.Option className="w-1/3 sm:w-auto" value={cam.children[0].value}>{cam.title}</Select.Option>
                                                    ))
                                                }
                                                </Select>
                                            </Form.Item>
                                            <a onClick={()=>form.setFieldValue('mashiniiDugaar', '')} className="ml-2 px-2 flex items-center rounded border border-red-400  hover:bg-red-200 h-8">Цэвэрлэх</a>
                                        </Form>

                                        <div className="flex flex-wrap">
                                            <div className="flex flex-wrap w-full">
                                                {
                                                    ['0','1','2','3','4','5','6','7','8','9'].map(n=>(
                                                        <a onClick={()=>keyPadHandler(n)} className="py-2 px-3 rounded m-1 border hover:bg-green-200">{n}</a>
                                                    ))
                                                }
                                            </div>
                                            {
                                                usguud.map((useg)=>(
                                                    <a onClick={()=>keyPadHandler(useg)} className="py-2 px-3 rounded m-1 border hover:bg-green-200">{useg}</a>
                                                ))
                                            }
                                        </div>
                                        {/*<div className="flex w-full items-center">
                                            <label>Дугаар</label>

                                        </div>*/}
                                    </>
                            }
                        </Space>
                    </Modal>
                </div>
            ) : (
                <div className="col-span-12 flex justify-center">
                    {ajiltan?.ner}-д зогсоолын эрх байхгүй байна.
                </div>
            )}
        </Admin>
    );
}

export const getServerSideProps = shalgaltKhiikh;

export default camera;
