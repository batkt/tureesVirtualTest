import React, {useEffect, useRef, useState} from "react";
import {
    LoadingOutlined,
} from "@ant-design/icons";


function StackStream({ tuluv }) {
    const wsRefs = useRef([]);
    const [onOpen, setOnOpen] = useState(false);
    useEffect(() => {
        if(tuluv){
            const urls = [
                'ws://192.168.1.54:9080/ws?token=db1f2387-766d-29b5-41d2-43dbea5bd7fc&channel=1',
                'ws://192.168.1.56:9080/ws',
                'ws://192.168.1.55:9080/ws?token=b6aafed0-35b1-7a98-97b5-e7a797fe9b4a&channel=1',
                'ws://192.168.1.57:9080/ws?token=d8142256-e92f-57fe-60e4-2aa83de7832c&channel=1',
            ];

            try {
                urls.forEach((url, index) => {
                    const ws = new WebSocket(url);
                    ws.binaryType = 'arraybuffer';
                    ws.onopen = () => {
                        console.log(`WebSocket kholbolt amjilttai ${index + 1}`);
                    };
                    ws.onclose = () => {
                        console.log(`WebSocket kholbolt amjiltgui bolloo ${index + 1} `);
                    };
                    wsRefs.current.push(ws);
                });
                wsRefs?.current.length === 4 && setOnOpen(true);
            } catch (e) {
                console.log(e.message)
            }
        } else {
            wsRefs?.current.forEach((ws) => {
                ws.close();
            });
        }

        return () => {
            wsRefs?.current.forEach((ws) => {
                ws.close();
            });
        };
    }, [tuluv]);

    useEffect(() => {
        if(onOpen){
            wsRefs.current.forEach((ws, index) => {
                ws.onmessage = async (event) => {
                    const imageData = event.data;
                    const canvas = document.getElementById(`canvas${index}`);
                    const ctx = canvas.getContext('2d');
                    console.log('0-0-',index,' - ', canvas, ' ws ', ws);
                    const imgWidth = 600;
                    const imgHeight = 400;
                    try {
                        const blob = new Blob([imageData]);
                        const imageBitmap = await createImageBitmap(blob);
                        ctx.drawImage(imageBitmap, 0, 0, imgWidth, imgHeight);
                    } catch (error) {
                        console.error('Error decoding image:', error);
                    }
                }
            });
        }else {
            wsRefs.current.forEach((ws) => {
                if (!!ws?.onmessage) ws.onmessage = null;
            });
        }
        return () => {
            wsRefs.current.forEach((ws) => {
                if (!!ws?.onmessage) ws.onmessage = null;
            });
        };
    }, [onOpen]);

    return (
        <div className='grid xl:grid-cols-1 2xl:grid-cols-2'>
            <div className='border'>
                <canvas id="canvas0" width="600" height="400" />
            </div>
            <div className='border'>
                <canvas id="canvas1" width="600" height="400" />
            </div>
            <div className='border'>
                <canvas id="canvas2" width="600" height="400" />
            </div>
            <div className='border'>
                <canvas id="canvas3" width="600" height="400" />
            </div>
        </div>
    );
}

export default StackStream;
