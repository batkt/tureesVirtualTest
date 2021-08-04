/* global google*/
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useGoogleMap } from '@react-google-maps/api'

function CustomDrawingManagerControl({ children, bairshil = 'RIGHT' }) {
    const controlDiv = document.createElement('div');
    let map = useGoogleMap()
    useEffect(() => {

        const controls = map.controls[google.maps.ControlPosition[bairshil]];
        const index = controls.length;
        controls.push(controlDiv);
        return () => {
            controls.removeAt(index);
        };
    });

    return createPortal(
        <div>{children}</div>,
        controlDiv
    );
}

export default CustomDrawingManagerControl