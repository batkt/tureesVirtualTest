import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import fitBounds from "tools/function/fitBounds";
function IBIGazriinZurag(props, ref) {
  const { children, afterLoadMap, useAfterLoadMap, ...ohter } = props;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDklaMwR1Dxa6T7G0EXxgWJb8Ie9I51l4I",
  });

  const [map, setMap] = React.useState(null);

  useEffect(() => {
    if (!!map && isLoaded && !!afterLoadMap && useAfterLoadMap) afterLoadMap();
  }, [map, isLoaded, useAfterLoadMap]);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback() {
    setMap(null);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      fitBounds: (path) => fitBounds(map, path),
    }),
    [map]
  );

  return isLoaded ? (
    <GoogleMap
      id="map"
      mapContainerStyle={{
        height: "100%",
        width: "100%",
      }}
      onLoad={onLoad}
      onUnmount={onUnmount}
      {...ohter}
    >
      {children}
    </GoogleMap>
  ) : (
    <></>
  );
}

export default forwardRef(IBIGazriinZurag);
