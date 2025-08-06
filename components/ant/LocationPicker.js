import React from "react";
import GazriinZurag from "components/gazriinZurag/GazriinZurag";
import { Marker } from "@react-google-maps/api";
function LocationPicker({ value, onChange }) {
  const [position, setPosition] = React.useState({
    lat: value?.coordinates[0],
    lng: value?.coordinates[1],
  });
  function onDragEnd(e) {
    setPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    onChange({ type: "Point", coordinates: [e.latLng.lat(), e.latLng.lng()] });
  }

  return (
    <div className="h-32 w-full">
      <GazriinZurag
        center={{
          lat: position?.lat || 47.927094,
          lng: position?.lng || 106.887425,
        }}
        zoom={13}
        options={{
          fullscreenControlOptions: { position: 12 },
          disableDoubleClickZoom: true,
          fullscreenControl: true,
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
        }}
      >
        <Marker
          draggable
          onDragEnd={onDragEnd}
          position={{
            lat: position?.lat || 47.927094,
            lng: position?.lng || 106.887425,
          }}
        />
      </GazriinZurag>
    </div>
  );
}

export default LocationPicker;
