import React, {useEffect, useRef, useState} from "react";
import {
    LoadingOutlined,
} from "@ant-design/icons";

// ws://192.168.1.55:9080/ws.flv?token=b6aafed0-35b1-7a98-97b5-e7a797fe9b4a&channel=1
// ws://192.168.1.57:9080/ws.flv?token=d8142256-e92f-57fe-60e4-2aa83de7832c&channel=1
// ws://192.168.1.54:9080/ws.flv?token=db1f2387-766d-29b5-41d2-43dbea5bd7fc&channel=1


function Stream1({ ip }) {
    const ws = useRef(null);
    const [onOpen, setOnOpen] = useState(false);
    useEffect(() => {
        // console.log(url!==null ? url : 'ws://192.168.1.54:9080/ws');
        if(!!ip){
            const url = ip === '192.168.1.54' ? `ws://192.168.1.54:9080/ws.flv?token=db1f2387-766d-29b5-41d2-43dbea5bd7fc&channel=1` : 'ws://192.168.1.57:9080/ws.flv?token=d8142256-e92f-57fe-60e4-2aa83de7832c&channel=1\n';
            try {
                console.log('url', url);
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

        }else {
            if (ws.current) {
                ws.current.close();
            }
            setOnOpen(false);
        }
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [ip]);

    useEffect(() => {
        if(onOpen){
            let accumulatedData = new Uint8Array();
            // console.log('464666545646111111', onOpen);
            ws.current.onmessage = async (event) => {
                const imageData = event.data;
                const canvas = document.getElementById('canvas1');
                const ctx = canvas.getContext('2d');
                const imgWidth = 540;
                const imgHeight = 250;

                /*try {
                    const blob = new Blob([imageData]);
                    const  = await createImageBitmap(blob);
                    console.log('imageBitmap1111', imageBitmap);
                    ctx.drawImage(imageBitmap, 0, 0, imgWidth, imgHeight);
                } catch (error) {
                    console.error('Error decoding image:', error);
                }*/

                try {
                    const newChunk = new Uint8Array(event.data);
                    accumulatedData = new Uint8Array([...accumulatedData, ...newChunk]);

                    /*const isJPEG = (data) => {
                        const jpegMagicNumber = [0xFF, 0xD8];
                        const magicBytes = new Uint8Array(data.slice(0, 2));
                        return Array.from(magicBytes).every((byte, index) => byte === jpegMagicNumber[index]);
                    };

                    const isPNG = (data) => {
                        const pngMagicNumber = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
                        const magicBytes = new Uint8Array(data.slice(0, 8));
                        return Array.from(magicBytes).every((byte, index) => byte === pngMagicNumber[index]);
                    };

                    const isGIF = (data) => {
                        const gifMagicNumber = [0x47, 0x49, 0x46, 0x38];
                        const magicBytes = new Uint8Array(data.slice(0, 4));
                        return Array.from(magicBytes).every((byte, index) => byte === gifMagicNumber[index]);
                    };*/
                    const isJPEG = (data) => {
                        return data[0] === 0xFF && data[1] === 0xD8;
                    };

                    const isPNG = (data) => {
                        return (
                            data[0] === 0x89 &&
                            data[1] === 0x50 &&
                            data[2] === 0x4E &&
                            data[3] === 0x47 &&
                            data[4] === 0x0D &&
                            data[5] === 0x0A &&
                            data[6] === 0x1A &&
                            data[7] === 0x0A
                        );
                    };

                    const isGIF = (data) => {
                        return (
                            data[0] === 0x47 &&
                            data[1] === 0x49 &&
                            data[2] === 0x46 &&
                            data[3] === 0x38
                        );
                    };
                    if (accumulatedData.length >= 8) {
                        console.log('accumulatedData--', accumulatedData);
                        if (isJPEG(accumulatedData)) {
                            console.log('Image is in JPEG format');
                        } else if (isPNG(accumulatedData)) {
                            console.log('Image is in PNG format');
                        } else if (isGIF(accumulatedData)) {
                            console.log('Image is in GIF format');
                        } else {
                            console.log('Unsupported image format');
                        }

                        // Clear accumulated data after format detection
                        accumulatedData = new Uint8Array();
                    }

                    /*if (isJPEG(imageData)) {
                        console.log('Image is JPEG format');
                    } else if (isPNG(imageData)) {
                        console.log('Image is PNG format');
                    } else if (isGIF(imageData)) {
                        console.log('Image is GIF format');
                    } else {
                        console.log('Unsupported image format');
                        return;
                    }*/

                } catch (e) {
                    console.log('canva1 err ',e.message);
                }
                /*const blobData = event.data;
                const reader = new FileReader();

                reader.onload = () => {
                    const arrayBuffer = reader.result;
                    const uint8Array = new Uint8Array(arrayBuffer);

                    if (isJPEG(uint8Array)) {
                        console.log('Image is in JPEG format');
                    } else if (isPNG(uint8Array)) {
                        console.log('Image is in PNG format');
                    } else if (isGIF(uint8Array)) {
                        console.log('Image is in GIF format');
                    } else {
                        console.log('Unsupported image format');
                    }
                };

                reader.readAsArrayBuffer(blobData);

                const isJPEG = (data) => {
                    // Check magic numbers for JPEG format
                    return data[0] === 0xFF && data[1] === 0xD8;
                };

                const isPNG = (data) => {
                    // Check magic numbers for PNG format
                    return (
                        data[0] === 0x89 &&
                        data[1] === 0x50 &&
                        data[2] === 0x4E &&
                        data[3] === 0x47 &&
                        data[4] === 0x0D &&
                        data[5] === 0x0A &&
                        data[6] === 0x1A &&
                        data[7] === 0x0A
                    );
                };

                const isGIF = (data) => {
                    // Check magic numbers for GIF format
                    return (
                        data[0] === 0x47 &&
                        data[1] === 0x49 &&
                        data[2] === 0x46 &&
                        data[3] === 0x38
                    );
                };*/


                /* console.log('imageData0000', imageData);
                 const imageBitmap = createImageBitmap(new Blob([imageData]), 0, 0, imgWidth, imgHeight);
                 console.log('imageBitmap0000', imageBitmap);
                 imageBitmap.then((bitmap) => {
                     ctx.drawImage(bitmap, 0, 0, imgWidth, imgHeight);
                 });*/
            };
        } else {
            if (!!ws.current?.onmessage) ws.current.onmessage = null;
        }
        return () => {
            if (!!ws.current?.onmessage) ws.current.onmessage = null;
        };
    }, [onOpen]);

    return (
        <div>
            <canvas id="canvas1" width="540" height="250" />
        </div>
    )
}

export function Stream2({ ip }) {
    const ws2 = useRef(null);
    const [onOpen, setOnOpen] = useState(false);

    useEffect(() => {
        // console.log(url!==null ? url : 'ws://192.168.1.54:9080/ws');
        if(!!ip){                                                   // 'ws://192.168.1.55:9080/ws.flv?token=b6aafed0-35b1-7a98-97b5-e7a797fe9b4a&channel=1\n'
            const url = ip === '192.168.1.56' ? `ws://${ip}:9080/ws` : 'ws://192.168.1.55:9080/ws.flv?token=b6aafed0-35b1-7a98-97b5-e7a797fe9b4a&channel=1\n';
            console.log('url111', url);
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
        }else {
            if (ws2.current) {
                ws2.current.close();
            }
            setOnOpen(false);
        }
        return () => {
            if (ws2.current) {
                ws2.current.close();
            }
        };
    }, [ip]);

    useEffect(() => {
        if(onOpen){
            let accumulatedData = new Uint8Array();
            ws2.current.onmessage = async (event) => {
                /*const imageData = event.data;
                const canvas = document.getElementById('canvas2');
                const ctx = canvas.getContext('2d');
                const imgWidth = 540;
                const imgHeight = 250;
                try {
                    const blob = new Blob([imageData]);
                    const imageBitmap = await createImageBitmap(blob);
                    console.log('imageBitmap1111', imageBitmap);
                    ctx.drawImage(imageBitmap, 0, 0, imgWidth, imgHeight);
                } catch (error) {
                    console.error('Error decoding image:', error);
                }*/

                /*console.log('imageData111111', imageData);
                const imageBitmap = createImageBitmap(new Blob([imageData]), 0, 0, imgWidth, imgHeight);
                console.log('imageBitmap1111', imageBitmap);
                imageBitmap.then((bitmap) => {
                    ctx.drawImage(bitmap, 0, 0, imgWidth, imgHeight);
                });*/

                try {
                const newChunk = new Uint8Array(event.data);
                accumulatedData = new Uint8Array([...accumulatedData, newChunk]);
                const blob = new Blob([event.data]);
                console.log('blob ', blob);

                const isJPEG = (data) => {
                    return data[0] === 0xFF && data[1] === 0xD8;
                };

                const isPNG = (data) => {
                    return (
                        data[0] === 0x89 &&
                        data[1] === 0x50 &&
                        data[2] === 0x4E &&
                        data[3] === 0x47 &&
                        data[4] === 0x0D &&
                        data[5] === 0x0A &&
                        data[6] === 0x1A &&
                        data[7] === 0x0A
                    );
                };

                const isGIF = (data) => {
                    return (
                        data[0] === 0x47 &&
                        data[1] === 0x49 &&
                        data[2] === 0x46 &&
                        data[3] === 0x38
                    );
                };
                console.log('1231231', accumulatedData.length);
                if (accumulatedData.length >= 64) {
                    console.log('accumulatedData64--blob ', new Blob(accumulatedData));
                    console.log('accumulatedData64-- ', accumulatedData);
                    if (isJPEG(accumulatedData)) {
                        console.log('Image is in JPEG format');
                    } else if (isPNG(accumulatedData)) {
                        console.log('Image is in PNG format');
                    } else if (isGIF(accumulatedData)) {
                        console.log('Image is in GIF format');
                    } else {
                        console.log('Unsupported image format');
                    }

                    // Clear accumulated data after format detection
                    accumulatedData = new Uint8Array();
                }

                } catch (e) {
                    console.log('canva1 err ',e.message);
                }
            };
        }else {
            if (!!ws2.current?.onmessage) ws2.current.onmessage = null;
        }
        return () => {
            if (!!ws2.current?.onmessage) ws2.current.onmessage = null;
        };
    }, [onOpen]);

    return (
        <div>
            <canvas id="canvas2" width="540" height="250" />
        </div>
    )
}

export default Stream1;
