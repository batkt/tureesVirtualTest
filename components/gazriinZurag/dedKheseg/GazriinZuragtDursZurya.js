/* global google*/
import React from 'react'
const { DrawingManager } = require("@react-google-maps/api");
function IBIGazriinZuragtDursZurya(props) {
    const { zurakhTurul, options, ...other } = props
    return (
        <DrawingManager
            onPolygonComplete={(polygon) => {
                polygon.setMap(null);
                props.khatgainZamAvya(polygon.getPath().getArray());
            }}
            {...other}
            options={{
                drawingControl: false,
                drawingMode: google.maps.drawing.OverlayType[zurakhTurul],
                ...options
            }}
        />
    )
}

export default React.memo(IBIGazriinZuragtDursZurya)