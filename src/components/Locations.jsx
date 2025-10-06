import React from 'react';
import { MapPin, Star, ArrowRight } from 'lucide-react';

// location images
import Mistywood from '../assets/Images/MistyWood.png';
import Ambawadi from '../assets/Images/ambawadi.png';
import Swarg from '../assets/Images/Swarg.png';

const locations = [
  {
    id: 1,
    name: "Misty-Wood",
    description: "When trips are well-planned and enjoyable, they transform into our fulfilled dreams. Make your holidays special by visiting Misty Woods, where you can experience a natural climate and a pleasant environment. Enjoy luxurious villas, a large swimming pool, and a variety of indoor and outdoor games. Stay overnight with family and friends in a safe and secure area.",
    image: Mistywood,
    location: "15 Km from Vadodara",
    slug: "misty-wood"
  },
  {
    id: 2,
    name: "Riverfront",
    description: "Riverfront is a premium getaway resort located on Savli-Timba Road, near Manjusar GIDC. It has easy access from Anand, Godhar, Halol, and Vadodara. Riverfront is a highly recommended destination for individuals, families, corporate gatherings, and wellness-oriented groups. The resort offers a variety of amenities and facilities set against a lush green backdrop, focusing on recreation and rejuvenation.",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    location: "20 Km from Vadodara",
    slug: "azure-coastal"
  },
  {
    id: 3,
    name: "Ambawadi",
    description: "With 100,000 sq. ft. of lush greenery and an extravagant 18,000 sq. ft. clubhouse, Aambawadi stands out as the most developed villa plot project in all of Vadodara. The unique features available will leave you with just two things to do at Aambawadi: first, build your dream villa, and second, enjoy the rewards that come with it.",
    image: Ambawadi,
    location: "120 Km from Vadodara",
    slug: "summit-ridge"
  },
  {
    id: 4,
    name: "Swarg-Health Resort Bunglow No. 14",
    description: "Swarg, Maru Gaam is a stunning 20-acre project featuring beautifully landscaped greens that cover over 80% of the area. A clubhouse with 4 guest rooms, steam and sauna baths, a centralized kitchen with a barbecue, indoor games like table tennis and carrom, a multi-station gym, and shared restrooms.",
    image: Swarg,
    location: "25 Km from Vadodara",
    slug: "desert-oasis"
  },
  {
    id: 5,
    name: "Swarg-Health Resort Village No. 20",
    description: "Swarg, Maru Gaam is a stunning 20-acre project featuring beautifully landscaped greens that cover over 80% of the area. Designed to be Vastu compliant, Swarg offers a resort-like atmosphere in a village setting, allowing you to embrace the simple life amidst nature.",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    location: "25 Km from Vadodarae",
    slug: "lakeside-haven"
  },
  {
    id: 6,
    name: "Swarg-Health Resort Village No. 70",
    description: "Swarg, Maru Gaam is a stunning 20-acre project featuring beautifully landscaped greens that cover over 80% of the area. Designed to be Vastu compliant, Swarg offers a resort-like atmosphere in a village setting, allowing you to embrace the simple life amidst nature.",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    location: "25 Km from Vadodara",
    slug: "lakeside-haven"
  }
];

const Location = () => {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 sm:mb-24">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl text-gray-900 leading-tight tracking-tight mb-6">
          Our Locations
        </h1>
        <p className="mt-4 text-xl sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Explore our curated collection of world-class properties, each offering a unique and unforgettable experience
        </p>
      </div>

      {/* Location Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {locations.map((location, index) => (
          <div 
            key={location.id}
            className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-12 group`}
          >
            {/* Image Section */}
            <div className="w-full lg:w-1/2 relative overflow-hidden rounded-2xl shadow-2xl">
              <div className="relative h-80 lg:h-96 overflow-hidden">
                <img 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" 
                  src={location.image} 
                  alt={location.name}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               
              </div>
            </div>
            
            {/* Content Section */}
            <div className="w-full lg:w-1/2 space-y-6">
              {/* Location Tag */}
              <div className="flex items-center gap-2 text-[#008DDA]">
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wider">{location.location}</span>
              </div>
              
              {/* Title */}
              <h2 className="text-3xl lg:text-4xl text-gray-900 leading-tight">
                {location.name}
              </h2>
              
              {/* Description */}
              <p className="text-lg text-justify text-gray-600 leading-relaxed">
                {location.description}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <a 
                  href={`/locations/${location.slug}`} 
                  className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-xl text-white bg-[#008DDA] hover:bg-[#0278b8] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  View Details
                  <ArrowRight className="w-5 h-5" />
                </a>
                <button 
                  type="button" 
                  className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-xl text-[#008DDA] bg-white border-2 border-[#008DDA] hover:bg-indigo-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
};

export default Location;