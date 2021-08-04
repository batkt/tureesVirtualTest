/*global google */
function fitBounds(map, path) {
    try {
        if (!window.google)
            return
        const bounds = new google.maps.LatLngBounds();
        path.forEach(x => bounds.extend(new google.maps.LatLng(x.lat, x.lng)))
        if (!!map)
            map.fitBounds(bounds)
    } catch (error) {
        console.trace('fitBounds', error)
    }
}

export default fitBounds