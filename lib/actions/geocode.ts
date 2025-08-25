interface GeocodeResult {
  country: string;
  formattedAddress: string;
}

export async function getCountryFromCoordinates(
  lat: number,
  lng: number
): Promise<GeocodeResult> {
  const apiKey = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;
  if (!apiKey) {
    throw new Error("Mapbox access token is not set.");
  }

  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${apiKey}`
  );

  const data = await response.json();

  if (!data.features || data.features.length === 0) {
    return {
      country: "Unknown",
      formattedAddress: "Address not found for the given coordinates.",
    };
  }

  const result = data.features[0];

  const formattedAddress = result.place_name || "Unknown";

  interface ContextComponent {
    id: string;
    text: string;
    [key: string]: unknown;
  }

  const countryComponent = result.context?.find((component: ContextComponent) =>
    component.id.startsWith("country")
  );

  return {
    country: countryComponent?.text || "Unknown",
    formattedAddress: formattedAddress,
  };
}