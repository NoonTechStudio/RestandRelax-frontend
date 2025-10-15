import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { X, ChevronLeft, MapPin, Bed, Bath, Utensils, Sofa, Home, Waves } from 'lucide-react';
import axios from 'axios';

function LocationPhotos() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { images, currentIndex } = location.state || { images: [], currentIndex: 0 };
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex);
  const [locationData, setLocationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_CONNECTION_HOST;

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/locations/${id}`);
        setLocationData(res.data);
      } catch (err) {
        console.error('Error fetching location:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocation();
  }, [id]);

  const generateRoomTypes = () => {
    if (!locationData) return [];

    const rooms = [];
    const details = locationData.propertyDetails || {};
    const imageList = locationData.images || [];

    imageList.forEach((img, index) => {
      const title = img.title || img.alt || `Image ${index + 1}`;
      const imageName = title.toLowerCase();

      let roomName = title;
      let icon = Home;

      if (imageName.includes('living') || imageName.includes('lounge')) {
        roomName = 'Living room';
        icon = Sofa;
      } else if (imageName.includes('kitchen') || imageName.includes('dining')) {
        roomName = imageName.includes('dining') ? 'Dining area' : 'Full kitchen';
        icon = Utensils;
      } else if (imageName.includes('bedroom') || imageName.includes('bed')) {
        roomName = 'Bedroom';
        icon = Bed;
      } else if (imageName.includes('bathroom') || imageName.includes('bath')) {
        roomName = 'Full bathroom';
        icon = Bath;
      } else if (imageName.includes('pool') || imageName.includes('swim')) {
        roomName = 'Swimming Pool';
        icon = Waves;
      } else if (imageName.includes('garden') || imageName.includes('outdoor') || imageName.includes('patio')) {
        roomName = 'Garden Area';
        icon = Home;
      }

      rooms.push({
        name: roomName,
        icon: icon,
        imageUrl: img.url,
        alt: img.alt || roomName,
        title: img.title || roomName
      });
    });

    return rooms;
  };

  const roomTypes = generateRoomTypes();

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') navigate(-1);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading photo gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-900 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>

        {locationData && (
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <MapPin size={14} />
              <span>{locationData.name}</span>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Photo Tour Title */}
          <h1 className="text-3xl font-semibold text-gray-900 mb-8">Photo tour</h1>

          {/* Top Section - Small Thumbnails with Labels */}
          <div className="mb-12">
            <div className="flex gap-4 overflow-x-auto pb-4">
              {roomTypes.map((room, index) => {
                const IconComponent = room.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      const element = document.getElementById(`room-${index}`);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    className="flex-shrink-0 group cursor-pointer"
                  >
                    <div className="w-40 h-32 rounded-lg overflow-hidden mb-2 border border-gray-200 hover:border-gray-400 transition-all">
                      <img
                        src={`${API_BASE_URL}${room.imageUrl}`}
                        alt={room.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop';
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      {/* <IconComponent size={16} className="text-gray-600" /> */}
                      <span className="text-sm font-medium text-gray-900">{room.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Section - Large Images with Left Labels */}
          <div className="space-y-12">
            {roomTypes.map((room, index) => {
              const IconComponent = room.icon;
              return (
                <div
                  key={index}
                  id={`room-${index}`}
                  className="flex gap-8 items-start scroll-mt-8"
                >
                  {/* Left Side - Room Type Label */}
                  <div className="w-96 flex-shrink-0 pt-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2">
                        {/* <IconComponent size={20} className="text-gray-700" /> */}
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">{room.alt}</h2>
                    </div>
                  </div>

                  {/* Right Side - Large Image */}
                  <div className="flex-1">
                    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                      <img
                        src={`http://localhost:5000${room.imageUrl}`}
                        alt={room.alt}
                        className="w-full h-auto object-cover"
                        style={{ maxHeight: '500px' }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop';
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {roomTypes.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X size={32} className="text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">No photos available</p>
              <p className="text-gray-600">This property doesn't have any photos yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LocationPhotos;
