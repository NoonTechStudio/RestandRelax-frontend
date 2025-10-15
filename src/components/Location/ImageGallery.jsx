import { Grid3x3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ImageGallery = ({ locationId, images }) => {
  const navigate = useNavigate();
  const { mainImage, otherImages, allImages } = images;
  const remainingImagesCount = Math.max(0, allImages.length - 5);

  const handleImageClick = (imageIndex) => {
    navigate(`/locations-details/${locationId}/photos`, { 
      state: { 
        images: allImages,
        currentIndex: imageIndex 
      } 
    });
  };

  const handleShowAllPhotos = () => {
    navigate(`/locations-details/${locationId}/photos`, { 
      state: { 
        images: allImages,
        currentIndex: 0 
      } 
    });
  };

  return (
    <div className="relative mb-8">
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[500px] rounded-xl overflow-hidden">
        {/* Main image */}
        <div className="col-span-2 row-span-2 bg-gray-200 animate-fadeIn">
          <img
            src={mainImage}
            alt="Property main view"
            className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all duration-200"
            onClick={() => {
              const mainImageIndex = allImages.indexOf(mainImage);
              handleImageClick(mainImageIndex >= 0 ? mainImageIndex : 0);
            }}
          />
        </div>
        
        {/* Other images */}
        {[0, 1, 2, 3].map((index) => (
          <div 
            key={index} 
            className="col-span-1 row-span-1 bg-gray-200 animate-fadeIn" 
            style={{ animationDelay: `${(index + 1) * 100}ms` }}
          >
            <img
              src={otherImages[index] || allImages[index + 1]}
              alt={`Property view ${index + 2}`}
              className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all duration-200"
              onClick={() => {
                const imageIndex = allImages.indexOf(otherImages[index] || allImages[index + 1]);
                handleImageClick(imageIndex >= 0 ? imageIndex : index + 1);
              }}
            />
          </div>
        ))}
      </div>

      {/* Show all photos button */}
      {remainingImagesCount > 0 && (
        <button 
          onClick={handleShowAllPhotos}
          className="absolute bottom-4 right-4 bg-white px-4 py-3 rounded-lg flex items-center gap-2 font-medium text-sm hover:bg-gray-50 shadow-lg border border-gray-200 z-10 animate-fadeIn"
          style={{ animationDelay: '500ms' }}
        >
          <Grid3x3 size={16} />
          Show all {allImages.length} photos
        </button>
      )}
    </div>
  );
};

export default ImageGallery;