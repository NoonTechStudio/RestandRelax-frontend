import React, { useState, useEffect } from 'react';
import { MapPin, Filter, X, Search, Heart, Share2, ZoomIn } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_CONNECTION_HOST;

const MemoriesGallery = () => {
  const [locations, setLocations] = useState([]);
  const [allImages, setAllImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch locations and their images
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const locationsResponse = await axios.get(`${API_BASE_URL}/api/locations`);
        const locationsData = locationsResponse.data;

        const locationsWithImages = await Promise.all(
          locationsData.map(async (location) => {
            try {
              const imagesResponse = await axios.get(`${API_BASE_URL}/api/locations/${location._id}`);
              const images = imagesResponse.data.images || [];
              
              const imagesWithLocation = images.map(img => ({
                ...img,
                locationId: location._id,
                locationName: location.name,
                fullUrl: `${API_BASE_URL}${img.url}`,
                city: location.address?.city || 'Unknown'
              }));

              return {
                ...location,
                images: imagesWithLocation
              };
            } catch (imgError) {
              return { ...location, images: [] };
            }
          })
        );

        setLocations(locationsWithImages);

        const allImagesArray = locationsWithImages.flatMap(location => 
          location.images.map(img => ({
            ...img,
            locationId: location._id,
            locationName: location.name
          }))
        );

        setAllImages(allImagesArray);
        setFilteredImages(allImagesArray);
        setLoading(false);

      } catch (err) {
        setError('Failed to load memories. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter images by location and search
  useEffect(() => {
    let filtered = allImages;

    if (selectedLocation !== 'all') {
      filtered = filtered.filter(img => img.locationId === selectedLocation);
    }

    if (searchTerm) {
      filtered = filtered.filter(img => 
        img.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (img.title && img.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (img.alt && img.alt.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredImages(filtered);
  }, [selectedLocation, searchTerm, allImages]);

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-lg text-gray-600">Loading beautiful memories...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-25">
      <div className="lg:px-10 mx-auto px-4">
        
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm mb-6">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-600">Live Memories Gallery</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-4">
            Memory Lane
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover beautiful moments captured across our premium locations. Each picture tells a unique story.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black w-8 h-5" />
            <input
              type="text"
              placeholder="Search memories by location or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Enhanced Left Sidebar */}
          <div className="lg:w-100 flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
              
              {/* Filter Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Filter className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Filter Memories</h2>
                  <p className="text-sm text-gray-500">Browse by location</p>
                </div>
              </div>

              {/* Location List */}
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedLocation('all')}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 group ${
                    selectedLocation === 'all' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      selectedLocation === 'all' ? 'bg-white/20' : 'bg-blue-100'
                    }`}>
                      <MapPin className={`w-4 h-4 ${
                        selectedLocation === 'all' ? 'text-white' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <div className="font-semibold">All Locations</div>
                      <div className={`text-sm ${
                        selectedLocation === 'all' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {allImages.length} memories
                      </div>
                    </div>
                  </div>
                </button>

                {locations.map(location => (
                  <button
                    key={location._id}
                    onClick={() => setSelectedLocation(location._id)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 group ${
                      selectedLocation === location._id 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                        : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-200 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        selectedLocation === location._id ? 'bg-white/20' : 'bg-gray-100'
                      }`}>
                        <MapPin className={`w-4 h-4 ${
                          selectedLocation === location._id ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{location.name}</div>
                        <div className={`text-sm truncate ${
                          selectedLocation === location._id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {location.images.length} memories
                        </div>
                        {location.address?.city && (
                          <div className={`text-xs ${
                            selectedLocation === location._id ? 'text-blue-200' : 'text-gray-400'
                          } mt-1`}>
                            {location.address.city}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{locations.length}</div>
                    <div className="text-xs text-gray-500">Locations</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{allImages.length}</div>
                    <div className="text-xs text-gray-500">Total Memories</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Gallery */}
          <div className="flex-1">
            
            {/* Results Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedLocation === 'all' 
                      ? 'All Memories' 
                      : locations.find(loc => loc._id === selectedLocation)?.name
                    }
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {filteredImages.length} beautiful memory{filteredImages.length !== 1 ? 'ies' : ''} found
                  </p>
                </div>
                {selectedLocation !== 'all' && (
                  <button
                    onClick={() => setSelectedLocation('all')}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shrink-0"
                  >
                    <X className="w-4 h-4" />
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

            {/* Enhanced Pinterest Masonry Grid - FIXED */}
            {filteredImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredImages.map((image, index) => (
                  <div 
                    key={`${image.locationId}-${index}`}
                    className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 cursor-pointer"
                    onClick={() => openLightbox(image)}
                  >
                    {/* Image Container - FIXED: Remove fixed height and use aspect ratio */}
                    <div className="relative overflow-hidden">
                      <div className="w-full h-0 pb-[125%] relative"> {/* Creates a 4:5 aspect ratio container */}
                        <img
                          src={image.fullUrl}
                          alt={image.alt || image.title || `Memory from ${image.locationName}`}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                          }}
                        />
                      </div>
                      
                      {/* Overlay with Actions */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button 
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add like functionality here
                            }}
                          >
                            <Heart className="w-4 h-4 text-gray-700" />
                          </button>
                          <button 
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add share functionality here
                            }}
                          >
                            <Share2 className="w-4 h-4 text-gray-700" />
                          </button>
                        </div>
                        
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center gap-2 text-white mb-2">
                            <MapPin className="w-4 h-4" />
                            <span className="font-semibold text-sm">{image.locationName}</span>
                          </div>
                          {(image.title || image.alt) && (
                            <p className="text-white/90 text-xs line-clamp-2">
                              {image.title || image.alt}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ZoomIn className="w-4 h-4 text-white" />
                            <span className="text-white text-xs font-medium">Click to view</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Enhanced Empty State */
              <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100">
                <div className="text-6xl mb-4">📸</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">No memories found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {selectedLocation === 'all' 
                    ? 'We\'re waiting to capture beautiful moments. Check back soon!' 
                    : 'No images found for this location yet.'
                  }
                </p>
                {(selectedLocation !== 'all' || searchTerm) && (
                  <button
                    onClick={() => {
                      setSelectedLocation('all');
                      setSearchTerm('');
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    View All Memories
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full">
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedImage.fullUrl}
              alt={selectedImage.alt || selectedImage.title}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold text-lg">{selectedImage.locationName}</span>
              </div>
              {(selectedImage.title || selectedImage.alt) && (
                <p className="text-white/90 text-sm">
                  {selectedImage.title || selectedImage.alt}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default MemoriesGallery;