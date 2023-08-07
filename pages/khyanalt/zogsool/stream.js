
import React, { useEffect, useRef } from "react";



function StreamTest({ token }) {
    const ws = useRef(null);

    useEffect(() => {


// Replace 'wss://your-websocket-url' with your WebSocket server URL
        ws.current = new WebSocket('wss://192.168.1.56:9080/wss');

        ws.current.binaryType = 'arraybuffer';

        ws.current.onopen = () => {
            console.log('WebSocket connection opened');
        };

        ws.current.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
// Clean up the WebSocket connection on component unmount
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    useEffect(() => {
        // Previous WebSocket setup code...

        ws.current.onmessage = (event) => {
            // Handle incoming binary message (arraybuffer)
            const imageData = event.data;

            // Process the image data (assuming it's an image)
            // For example, render it on a canvas:
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');

            // Assuming you know the image dimensions (width and height)
            const imgWidth = 800;
            const imgHeight = 600;

            const imageBitmap = createImageBitmap(new Blob([imageData]), 0, 0, imgWidth, imgHeight);
            imageBitmap.then((bitmap) => {
                ctx.drawImage(bitmap, 0, 0, imgWidth, imgHeight);
            });
        };
    }, []);



    return (
        <div>
            <canvas id="canvas" width="800" height="600" />
        </div>
    )

}

export default StreamTest;
