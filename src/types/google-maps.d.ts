// Type definitions for Google Maps JavaScript API 3.51
// Source: https://developers.google.com/maps/documentation/javascript/reference

declare namespace google {
  namespace maps {
    type MapsEventHandler = (...args: unknown[]) => void;

    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      getCenter(): LatLng;
      setZoom(zoom: number): void;
      getZoom(): number;
      addListener(eventName: string, handler: MapsEventHandler): MapsEventListener;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setPosition(latLng: LatLng | LatLngLiteral): void;
      getPosition(): LatLng;
      setMap(map: Map | null): void;
      getMap(): Map | null;
      addListener(eventName: string, handler: MapsEventHandler): MapsEventListener;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
      toJSON(): LatLngLiteral;
    }

    class Geocoder {
      geocode(request: GeocoderRequest, callback: (results: GeocoderResult[], status: string) => void): void;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeId?: string;
      disableDefaultUI?: boolean;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string;
      draggable?: boolean;
      animation?: Animation;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface MapsEventListener {
      remove(): void;
    }

    interface GeocoderRequest {
      address?: string;
      location?: LatLng | LatLngLiteral;
    }

    interface GeocoderResult {
      geometry: {
        location: LatLng;
      };
      formatted_address: string;
    }

    interface MapMouseEvent {
      latLng?: LatLng;
    }

    enum Animation {
      DROP,
      BOUNCE
    }

    namespace event {
      function clearInstanceListeners(instance: unknown): void;
    }
  }
}

declare global {
  interface Window {
    google: typeof google;
  }
}
