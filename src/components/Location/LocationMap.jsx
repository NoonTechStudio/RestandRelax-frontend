import { MapPin, Flag, Navigation } from 'lucide-react';

const LocationMap = ({ location }) => {
  const latitude = location?.latitude;
  const longitude = location?.longitude;
  const address = location?.address;

  // Generate OpenStreetMap link
  const generateOSMLink = () => {
    if (!latitude || !longitude) return '#';
    return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`;
  };

  // Generate iframe map (no API key required)
  const renderMap = () => {
    if (!latitude || !longitude) {
      return (
        <div className="w-full h-100 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MapPin size={48} className="mx-auto mb-2" />
            <p>Map location not available</p>
          </div>
        </div>
      );
    }

    return (
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`}
        className="h-96 w-full"
        title="Location Map"
      />
    );
  };

  const formatAddress = () => {
    if (!address) return 'Address information not available';
    
    const parts = [];
    if (address.line1) parts.push(address.line1);
    if (address.line2) parts.push(address.line2);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.country) parts.push(address.country);
    if (address.pincode) parts.push(address.pincode);
    
    return parts.join(', ') || 'Address information not available';
  };

  // Sample nearby places - you can replace with actual data from your API
  const nearbyPlaces = [
    "Jardins du Trocadéro",
    "Champ de Mars", 
    "Hôte des Invalides",
    "Tour Eiffel"
  ];

  return (
    <div className="mt-16 border-t border-gray-200 pt-12 w-full">
      <div className="w-full">
        <h3 className="font-semibold text-2xl mb-8 px-6">Where you'll be</h3>
        
        {/* Full Width Map Container */}
        <div className="w-full">
          <div className="border border-gray-200 rounded-xl overflow-hidden mx-6">
            {/* Map Container */}
            <div className="relative bg-gray-100 w-full">
              {renderMap()}
              
              {/* Location Pin for static view */}
              {!latitude || !longitude ? (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="flex flex-col items-center">
                    <div className="bg-red-600 text-white p-2 rounded-full shadow-lg">
                      <MapPin size={20} />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Map Footer */}
            <div className="bg-white p-4 border-t border-gray-200 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Map Data © OpenStreetMap</span>
                  <span>•</span>
                  <span>500m</span>
                  <span>•</span>
                  <span>Terms</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                    <Flag size={16} />
                    Report a map error
                  </button>
                  
                  {latitude && longitude && (
                    <a
                      href={generateOSMLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      <Navigation size={16} />
                      Open in Maps
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Location Information - Below the map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 px-6">
          {/* Left Column - Address */}
          <div className="lg:col-span-1 space-y-6">
            {/* Address Section */}
            {/* <div>
              <h4 className="font-semibold text-lg mb-3">Location Details</h4>
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 font-medium mb-2">
                    {formatAddress()}
                  </p>
                  {latitude && longitude && (
                    <p className="text-sm text-gray-500">
                      Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>
            </div> */}
          </div>

          {/* Middle Column - Nearby Places */}
          {/* <div className="lg:col-span-1">
            <h4 className="font-semibold text-lg mb-3">Nearby Attractions</h4>
            <div className="space-y-2">
              {nearbyPlaces.map((place, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-700">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span className="text-sm">{place}</span>
                </div>
              ))}
            </div>
          </div> */}

          {/* Right Column - Getting Around */}
          {/* <div className="lg:col-span-1">
            <h4 className="font-semibold text-lg mb-3">Getting around</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Public transport</span>
                <span className="font-medium">5 min walk</span>
              </div>
              <div className="flex justify-between">
                <span>City center</span>
                <span className="font-medium">15 min drive</span>
              </div>
              <div className="flex justify-between">
                <span>Airport</span>
                <span className="font-medium">30 min drive</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default LocationMap;