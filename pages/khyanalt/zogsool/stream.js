import React, {useEffect, useRef, useState} from "react";
import {
    LoadingOutlined,
} from "@ant-design/icons";

// ws://192.168.1.55:9080/ws.flv?token=b6aafed0-35b1-7a98-97b5-e7a797fe9b4a&channel=1
// ws://192.168.1.57:9080/ws.flv?token=d8142256-e92f-57fe-60e4-2aa83de7832c&channel=1
// ws://192.168.1.54:9080/ws.flv?token=db1f2387-766d-29b5-41d2-43dbea5bd7fc&channel=1

function Stream1({ ip }) {
    const ws = useRef(null);
    console.log('hello', ip);
    const [onOpen, setOnOpen] = useState(false);

    useEffect(() => {
        // console.log(url!==null ? url : 'ws://192.168.1.54:9080/ws');
        if(!!ip){
            const url = ip === '192.168.1.54' ? `ws://192.168.1.54:9080/ws.flv?token=db1f2387-766d-29b5-41d2-43dbea5bd7fc&channel=1` : 'ws://192.168.1.55:9080/ws.flv?token=b6aafed0-35b1-7a98-97b5-e7a797fe9b4a&channel=1';
            try {
                console.log('1111114646665456461', ip);
                ws.current = new WebSocket(url);
                ws.current.binaryType = 'arraybuffer';
                ws.current.onopen = () => {
                    console.log('WebSocket kholbolt amjilttai');
                    setOnOpen(true);
                };
                ws.current.onclose = () => {
                    console.log('WebSocket kholbolt amjiltgui bolloo');
                };
            } catch (e) {
                console.log(e.message)
            }

        }
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [ip]);

    useEffect(() => {
        if(onOpen){
            console.log('464666545646111111', onOpen);
            ws.current.onmessage = (event) => {
                const imageData = event.data;
                const canvas = document.getElementById('canvas1');
                const ctx = canvas.getContext('2d');
                const imgWidth = 460;
                const imgHeight = 250;

                const imageBitmap = createImageBitmap(new Blob([imageData]), 0, 0, imgWidth, imgHeight);
                imageBitmap.then((bitmap) => {
                    ctx.drawImage(bitmap, 0, 0, imgWidth, imgHeight);
                });
            };
        }
    }, [onOpen]);

    return (
        <div>
            <canvas id="canvas1" width="460" height="250" />
        </div>
    )
}

export function Stream2({ ip }) {
    const ws2 = useRef(null);
    const [onOpen, setOnOpen] = useState(false);

    useEffect(() => {
        // console.log(url!==null ? url : 'ws://192.168.1.54:9080/ws');
        if(!!ip){
            const url = ip === '192.168.1.56' ? `ws://${ip}:9080/ws` : 'ws://192.168.1.55:9080/ws.flv?token=b6aafed0-35b1-7a98-97b5-e7a797fe9b4a&channel=1';
            console.log('hello', url);
            try {
                ws2.current = new WebSocket(url);
                ws2.current.binaryType = 'arraybuffer';
                ws2.current.onopen = () => {
                    console.log('WebSocket kholbolt amjilttai');
                    setOnOpen(true);
                };
                ws2.current.onclose = () => {
                    console.log('WebSocket kholbolt amjiltgui bolloo');
                };
            } catch (e) {
                console.log(e.message)
            }
        }
        return () => {
            if (ws2.current) {
                ws2.current.close();
            }
        };
    }, [ip]);

    useEffect(() => {
        if(onOpen){
            ws2.current.onmessage = (event) => {
                const imageData = event.data;
                const canvas = document.getElementById('canvas2');
                const ctx = canvas.getContext('2d');
                const imgWidth = 460;
                const imgHeight = 250;
                console.log('464666545646111111', imageData);
                const imageBitmap = createImageBitmap(new Blob([imageData]), 0, 0, imgWidth, imgHeight);
                imageBitmap.then((bitmap) => {
                    ctx.drawImage(bitmap, 0, 0, imgWidth, imgHeight);
                });
            };
        }
    }, [onOpen]);

    return (
        <div>
            <canvas id="canvas2" width="460" height="250" />
        </div>
    )
}

export default Stream1;
