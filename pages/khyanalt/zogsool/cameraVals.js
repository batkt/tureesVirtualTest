import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import { useTranslation } from "react-i18next";
import { useAuth } from "services/auth";
import useJagsaalt from "../../../hooks/useJagsaalt";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import R2WPlayerComponent from "components/streamPlayer";
import axios from "axios";
import { Button } from "antd";
import { CloseOutlined, DragOutlined } from "@ant-design/icons";
import { SocketStream } from "./stream";

function cameraVals({ token }) {
    const { t, i18n } = useTranslation();
    const { baiguullaga, ajiltan, barilgiinId } = useAuth();
    const streamQuery = useMemo(() => {
        return {
            baiguullagiinId: baiguullaga?._id,
            barilgiinId: barilgiinId,
        };
    }, [baiguullaga?._id, barilgiinId]);
    const { jagsaalt: parkingJagsaalt, mutate: parkingMutate } = useJagsaalt("/parking", streamQuery);
    const [cameraJagsaalt, setCameraJagsaalt] = useState([]);
    const [cameraW, setCameraW] = useState("w-1/4");
    const [cameraH, setCameraH] = useState(300);
    const [cameraKharakh, setCamerKharakh] = useState(false);
    
        
    useEffect(() => {
        cameraParking();
    }, [parkingJagsaalt]);

    const cameraParking = () => {
        var jagsaalt = [];
        {parkingJagsaalt?.forEach((item) => {
            {item?.khaalga?.forEach((khaalgaItem) => {
                {khaalgaItem?.camera?.forEach((cameraItem) => {
                    var tokhirgoo = parkingJagsaalt?.[0]?.tokhirgoo;
                    if (!!cameraItem?.cameraIP && !!cameraItem.tokhirgoo) {
                        tokhirgoo = cameraItem.tokhirgoo;
                    }
                    const temp = {
                        zogsoolNer: item.ner,
                        khaalgaNer: khaalgaItem.ner,
                        khaalgaTurul: khaalgaItem.turul,
                        cameraIP: cameraItem?.cameraIP,
                        tokhirgoo: tokhirgoo,
                    }
                    jagsaalt.push(temp);
                })}   
            })}
        })}    
        setCameraJagsaalt(jagsaalt);
        var w = "w-full";
        var h = screen.height;
        var div = 1;
        if(!!jagsaalt && jagsaalt.length > 1)
        {
            var l = jagsaalt.length;
            if(l === 2 || l === 4) 
                div = 2;
            else if(l === 3 || l === 5 || l === 6 || l === 9)
                div = 3
            else if(l === 7 || l === 8 || l === 10)
                div = 4
            else
                div = 6
            w = "w-1/" + div
            h = h/div
        }
        setCameraW(w);
        setCameraH(h);
    };

    const khaalgaNeey = (ip) => {
        if (baiguullaga?._id === "66c2c871597ea1390c3fd830") {
            let data =
            '<?xml version="1.0" encoding="UTF-8"?><BarrierGate><ctrlMode>open</ctrlMode></BarrierGate>';
            let config = {
            method: "put",
            maxBodyLength: Infinity,
            url: "http://" + ip + "/ISAPI/Parking/channels/1/barrierGate",
            auth: {
                username: "admin",
                password: "Asdf1199",
            },
            headers: {
                Accept: "*/*",
                Connection: "keep-alive",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            data: data,
            };
            axios
            .request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error);
            });
        } else
            axios
            .get("http://localhost:5000/api/neeye/" + ip + "")
            .then(function (response) {
                if (!!response) console.log("/api/neeye", response);
            })
            .catch(function (error) {
                console.log("ERROR: /api/neeye", error);
            });
    };

    return (
    <Admin
        khuudasniiNer='cameraVals'
        title='Камерын хяналт'
        className='p-4'
        dedKhuudas={true}
        tsonkhniiId={"66f17b724035091d77aa0136"}>
        <div className="col-span-12">
            <div className="flex flex-row flex-wrap">
                {cameraJagsaalt.map((data, index) => {
                    return (
                        <div className={`${cameraKharakh === index ? `fixed right-0 top-0 z-10 flex h-screen w-screen items-center justify-center rounded-md bg-black bg-opacity-80 p-2 md:py-[10%]` : cameraW}`} 
                            onClick={() => { setCamerKharakh(false); }}>
                            <div className={`cursor-pointer m-1 flex flex-col justify-between sm:flex-row font-bold ${cameraKharakh === index && "absolute top-5 w-[50%] text-white ml-5"}`}>
                                <div className="flex gap-3">
                                    {/* <DragOutlined/>     */}
                                    {data.zogsoolNer}
                                </div>
                                {data.khaalgaNer} - {data.khaalgaTurul}
                            </div>  
                            <div className={`m-1 rounded-md bg-[url('/notPlay.png')] bg-[length:100%_100%] bg-center ${cameraKharakh === index ? `sm:h-[80vh] sm:w-[80%]` : `sm:h-[${cameraH}px]`}`} style={{height: (cameraKharakh === index ? "80vh" : cameraH)}} 
                                onClick={(e) => { e.stopPropagation(); setCamerKharakh(index); }}>
                                {data.tokhirgoo?.socketEsekh === true ? (
                                    <SocketStream
                                    ip={data?.cameraIP}
                                    CHANNEL={data.tokhirgoo?.CHANNEL}
                                    PORT={data.tokhirgoo?.PORT}
                                    TOKEN={data.tokhirgoo?.TOKEN}
                                    />
                                ) : (<R2WPlayerComponent
                                        USER={data.tokhirgoo?.USER}
                                        ROOT={data.tokhirgoo?.ROOT}
                                        PASSWD={data.tokhirgoo?.PASSWD}
                                        Camer={data?.cameraIP}
                                        PORT={data.tokhirgoo?.PORT}
                                            /> )}    
                            </div>
                            {cameraKharakh === index && (
                                <div className="absolute right-5 top-5 text-3xl text-white">
                                <CloseOutlined
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    setCamerKharakh(false);
                                    }}
                                />
                                </div>
                            )}
                            <div className={`m-1 mt-1 flex flex-col justify-between sm:flex-row font-bold ${cameraKharakh === index && "absolute bottom-5 w-40"}`}>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={(e) => {
                                        khaalgaNeey(data?.cameraIP);
                                        }}
                                        className="w-full sm:w-auto"
                                        type="primary"
                                        id="neekhKhaalgaID"
                                    >
                                        {t("Нээх")}
                                    </Button>
                                </div>
                                <div className={`${cameraKharakh === index && "text-white ml-5"}`}>
                                    {data.cameraIP}
                                </div>
                            </div>    
                        </div>)
                })}
            </div>    
        </div>  
    </Admin>)
}

export const getServerSideProps = shalgaltKhiikh;

export default cameraVals;