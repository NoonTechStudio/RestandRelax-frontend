import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Share2, Heart, Star, MapPin, Key, Calendar, Tag, Flag } from 'lucide-react';
import { BookingModal, ImageGallery, GuestSelector, ReviewSection, LocationMap, Calenderdates } from '../components/Location';

// Components
// import ImageGallery from '../components/locationdetail/ImageGallery';
// import Calenderdates from './locationdetail/Calenderdates';
// import GuestSelector from '../components/locationdetail/GuestSelector';
// import BookingModal from '../components/locationdetail/BookingModal';
// import ReviewsSection from '../components/locationdetail/ReviewSection';
// import LocationMap from './locationdetail/LocationMap';
import LoadingSkeleton from '../components/Location/LoadingSkeletion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


// Utils
import { 
  generateMonths, 
  sanitizeHTML, 
  getOrganizedImages, 
  processAmenities,
  formatDate 
} from '../utils/locations/locationUitls';

function LocationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_CONNECTION_HOST;
  
  // Calendar and booking states
  const [currentMonth, setCurrentMonth] = useState(0);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    address: '',
    food: false
  });

  const guestSelectorRef = useRef(null);
  const months = generateMonths(6);

  // Close guest selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (guestSelectorRef.current && !guestSelectorRef.current.contains(event.target)) {
        setShowGuestSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch location data
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        setLoading(true);
        setReviewsLoading(true);
        setError(null);
        
        const [locationRes, reviewsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/locations/${id}`),
          axios.get(`${API_BASE_URL}/api/reviews/location/${id}`)
        ]);

        setLocation(locationRes.data);
        setReviews(reviewsRes.data);
        
        setLoading(false);
        setReviewsLoading(false);
      } catch (err) {
        console.error('Error fetching location data:', err);
        setError('Failed to load location data. Please refresh the page.');
        setLoading(false);
        setReviewsLoading(false);
      }
    };

    fetchLocationData();
    // In LocationDetail.jsx or at the top of your utility file
console.log('Environment variables:', import.meta.env);
console.log('API_CONNECTION_HOST:', import.meta.env.VITE_API_CONNECTION_HOST);
  }, [id]);

  const handleDateClick = (day, monthIndex) => {
    if (!day || !months[monthIndex]) return;

    const month = months[monthIndex];
    const clickedDate = new Date(month.year, month.month, day);
    
    if (location?.propertyDetails?.nightStay) {
      if (!checkInDate) {
        setCheckInDate(clickedDate);
        setSelectedDates([clickedDate]);
      } else if (!checkOutDate && clickedDate > checkInDate) {
        setCheckOutDate(clickedDate);
        const datesBetween = [];
        let currentDate = new Date(checkInDate);
        while (currentDate <= clickedDate) {
          datesBetween.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        setSelectedDates(datesBetween);
      } else {
        setCheckInDate(clickedDate);
        setCheckOutDate(null);
        setSelectedDates([clickedDate]);
      }
    } else {
      setCheckInDate(clickedDate);
      setCheckOutDate(null);
      setSelectedDates([clickedDate]);
    }
  };

  const handleGuestChange = (type, value) => {
    if (type === 'adults') {
      setAdults(value);
    } else {
      setKids(value);
    }
  };

  const handleBookNow = () => {
    if (!checkInDate) {
      alert('Please select check-in date');
      return;
    }
    if (location?.propertyDetails?.nightStay && !checkOutDate) {
      alert('Please select check-out date');
      return;
    }
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!/^\d{10}$/.test(bookingForm.phone)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      const bookingData = {
        locationId: id,
        name: bookingForm.name.trim(),
        phone: bookingForm.phone.trim(),
        address: bookingForm.address.trim(),
        food: bookingForm.food,
        checkInDate,
        checkOutDate,
        nights: checkInDate && checkOutDate && checkOutDate > checkInDate
          ? Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
          : 1,
        adults,
        kids,
        totalGuests: adults + kids
      };

      console.log('Booking data:', bookingData);
      alert('Booking submitted successfully!');
      setShowBookingModal(false);
      setBookingForm({ name: '', phone: '', address: '', food: false });
    } catch (error) {
      console.error('Booking error:', error);
      alert('Error submitting booking. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleReviewExpansion = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const renderStars = (rating) => {
    const numericRating = Number(rating) || 0;
    return (
      <div className="flex items-center gap-1">
        {[1,2,3,4,5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= numericRating ? "text-black fill-current" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  if (loading) return <LoadingSkeleton />;
  if (error) {
    return (
      <div className="min-h-screen bg-white py-10 flex items-center justify-center font-poppins">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors font-poppins"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
  if (!location) {
    return (
      <div className="min-h-screen bg-white py-10 flex items-center justify-center font-poppins">
        <div className="text-center text-gray-500">Location not found</div>
      </div>
    );
  }

  const images = getOrganizedImages(location);
  const amenities = processAmenities(location.amenities);
  const averageRating = reviews?.summary?.averageRating || 0;
  const totalReviews = reviews?.summary?.totalReviews || 0;
  const recommendedPercentage = reviews?.summary?.recommendedPercentage || 0;

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-white lg:py-25 font-poppins">
      {/* Header */}
      <header className="bg-white z-10 font-poppins">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 font-crimson">{location.name}</h1>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors font-poppins">
              <Share2 size={16} />
              <span className="text-sm font-medium underline">Share</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors font-poppins">
              <Heart size={16} />
              <span className="text-sm font-medium underline">Save</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 font-poppins">
        {/* Images Section */}
        <ImageGallery locationId={id} images={images} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          {/* LEFT SECTION */}
          <div className="lg:col-span-2">
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-2xl font-semibold mb-2 font-crimson">{location.name}</h2>
              <p className="text-gray-700 mb-3 font-poppins">
                {location.capacityOfPersons} guests · {location.propertyDetails?.bedrooms} bedrooms ·{' '}
                {location.propertyDetails?.bathrooms || 1} bathrooms
              </p>
              <div className="flex items-center gap-1 font-poppins">
                {reviewsLoading ? (
                  <div className="flex items-center gap-1 text-gray-500">
                    <Star size={16} className="text-gray-300" />
                    <span className="font-semibold">Loading...</span>
                  </div>
                ) : (
                  <>
                    {renderStars(Math.round(averageRating))}
                    <span className="font-semibold ml-1">{averageRating.toFixed(1)}</span>
                    <span className="mx-1">·</span>
                    <button 
                      onClick={() => navigate(`/location/${id}/reviews`)}
                      className="underline font-semibold hover:text-gray-700"
                    >
                      {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                    </button>
                    {recommendedPercentage > 0 && (
                      <>
                        <span className="mx-1">·</span>
                        <span className="text-green-600 font-bold text-[13px]">
                          {recommendedPercentage}% recommend
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Highlights */}
            <div className="border-b border-gray-200 pb-6 mb-6 space-y-4">
              <div className="flex items-start gap-4">
                <Key size={24} className="mt-1 flex-shrink-0 text-gray-700" />
                <div>
                  <h3 className="font-semibold mb-1 font-crimson">Exceptional check-in experience</h3>
                  <p className="text-gray-600 font-poppins">
                    {totalReviews > 0 
                      ? `${recommendedPercentage}% of guests gave the check-in process a 5-star rating.`
                      : "Guests consistently rate our check-in process 5 stars."
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin size={24} className="mt-1 flex-shrink-0 text-gray-700" />
                <div>
                  <h3 className="font-semibold mb-1 font-crimson">Address</h3>
                  <p className="text-gray-600 font-poppins">
                    {location.address?.line1 ?? 'Address unavailable'}{location.address?.line2 && `, ${location.address.line2}`}{location.address?.city && `, ${location.address.city}`}{location.address?.state && `, ${location.address.state}`}{location.address?.pincode && ` - ${location.address.pincode}`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Calendar size={24} className="mt-1 flex-shrink-0 text-gray-700" />
                <div>
                  <h3 className="font-semibold mb-1 font-crimson">Timings</h3>
                  <p className="text-gray-600 font-poppins">
                    Check-in 10:00 AM · Checkout next day 10:00 AM
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="space-y-4">
                <p 
                  className="text-gray-700 leading-relaxed font-poppins"
                  dangerouslySetInnerHTML={{ 
                    __html: sanitizeHTML(location.description || 'No description available.') 
                  }}
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="font-semibold text-2xl mb-6 font-crimson">What this place offers</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {amenities.map((amenity, idx) => {
                  const IconComponent = amenity.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3 py-2 font-poppins">
                      <IconComponent size={20} className="text-gray-700 flex-shrink-0" />
                      <span className="text-gray-800">{amenity.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Calendar Section */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="font-semibold text-2xl mb-6 font-crimson">Check Availability</h3>
              <Calenderdates
                months={months}
                currentMonth={currentMonth}
                onMonthChange={setCurrentMonth}
                selectedDates={selectedDates}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                onDateClick={handleDateClick}
                locationId={id}
              />
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => {
                    setCheckInDate(null);
                    setCheckOutDate(null);
                    setSelectedDates([]);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-poppins"
                >
                  Clear dates
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION - Booking Card */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div className="border border-gray-200 rounded-xl shadow-lg p-6 font-poppins">
                <div className="grid grid-cols-2 border border-gray-300 rounded-lg mb-4">
                  <div className="border-r border-gray-300 p-3">
                    <div className="text-xs font-semibold text-gray-700 mb-1">CHECK-IN</div>
                    <div className="font-medium">
                      {checkInDate ? formatDate(checkInDate) : 'Select date'}
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-xs font-semibold text-gray-700 mb-1">CHECKOUT</div>
                    <div className="font-medium">
                      {checkOutDate ? formatDate(checkOutDate) : 
                      location?.propertyDetails?.nightStay ? 'Select date' : 'Next day'}
                    </div>
                  </div>
                </div>

                <GuestSelector
                  adults={adults}
                  kids={kids}
                  onGuestChange={handleGuestChange}
                  showGuestSelector={showGuestSelector}
                  setShowGuestSelector={setShowGuestSelector}
                  maxCapacity={location.capacityOfPersons}
                  ref={guestSelectorRef}
                />

                <button 
                  onClick={handleBookNow}
                  disabled={adults + kids > location.capacityOfPersons || !checkInDate}
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold py-3.5 rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all mb-4 disabled:opacity-50 disabled:cursor-not-allowed font-poppins"
                >
                  {adults + kids > location.capacityOfPersons 
                    ? `Maximum ${location.capacityOfPersons} guests allowed`
                    : 'Book Now'
                  }
                </button>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-start gap-3 text-sm">
                    <Tag size={24} className="text-pink-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1 font-crimson">Capacity Information</h4>
                      <p className="text-gray-600 font-poppins">
                        This location accommodates maximum {location.capacityOfPersons} guest{location.capacityOfPersons !== 1 ? 's' : ''}. 
                        Perfect for {location.capacityOfPersons === 1 ? 'solo travelers' : 
                                    location.capacityOfPersons === 2 ? 'couples' : 
                                    `small groups up to ${location.capacityOfPersons} people`}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:underline mx-auto font-poppins">
                  <Flag size={16} />
                  Report this listing
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection
          reviews={reviews}
          expandedReviews={expandedReviews}
          onToggleReviewExpansion={toggleReviewExpansion}
          locationId={id}
        />

        {location && (
          <LocationMap location={location} />
        )}
      </main>

      {/* Booking Modal */}
      <BookingModal
        showBookingModal={showBookingModal}
        setShowBookingModal={setShowBookingModal}
        bookingForm={bookingForm}
        onInputChange={handleInputChange}
        onSubmit={handleBookingSubmit}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        adults={adults}
        kids={kids}
        location={location}
      />
    </div>
    <Footer/>
    </>
  );
}

export default LocationDetail;