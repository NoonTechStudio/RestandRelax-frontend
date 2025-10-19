import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Share2, Heart, Star, MapPin, Key, Calendar, Tag, Flag, 
  Users, Bed, Bath, Clock, CheckCircle, Gift 
} from 'lucide-react';
import { BookingModal, ImageGallery, GuestSelector, ReviewSection, LocationMap, Calenderdates } from '../components/Location';

// Components
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

// Define the primary color for consistency
const PRIMARY_COLOR = '#008DDA';
const PRIMARY_COLOR_CLASS = 'text-[#008DDA]';

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
        // Start from the day after check-in for selection range, as check-in day is already selected
        currentDate.setDate(currentDate.getDate() + 1); 
        while (currentDate <= clickedDate) {
          datesBetween.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        setSelectedDates([checkInDate, ...datesBetween]);
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
      const nights = checkInDate && checkOutDate && checkOutDate > checkInDate
          ? Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
          : 1;

      const bookingData = {
        locationId: id,
        name: bookingForm.name.trim(),
        phone: bookingForm.phone.trim(),
        address: bookingForm.address.trim(),
        food: bookingForm.food,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: location?.propertyDetails?.nightStay ? checkOutDate.toISOString() : null, // Only include if it's a night stay
        nights,
        adults,
        kids,
        totalGuests: adults + kids
      };

      console.log('Booking data:', bookingData);
      // NOTE: Placeholder for actual API call
      // const response = await axios.post(`${API_BASE_URL}/api/bookings`, bookingData);
      
      alert('Booking submitted successfully! We will contact you shortly.');
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
            className={star <= numericRating ? `${PRIMARY_COLOR_CLASS} fill-current` : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  if (loading) return <LoadingSkeleton />;
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 flex items-center justify-center font-inter">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-red-200">
          <div className="text-red-600 text-xl mb-4 font-semibold">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#008DDA] text-white px-6 py-3 rounded-lg hover:bg-[#0066a8] transition-colors font-semibold"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
  if (!location) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 flex items-center justify-center font-inter">
        <div className="text-center text-gray-500 p-8 bg-white rounded-xl shadow-lg">Location not found</div>
      </div>
    );
  }

  const images = getOrganizedImages(location);
  const amenities = processAmenities(location.amenities);
  const averageRating = reviews?.summary?.averageRating || 0;
  const totalReviews = reviews?.summary?.totalReviews || 0;
  const recommendedPercentage = reviews?.summary?.recommendedPercentage || 0;

  // Property Details for badges
  const propertyDetails = [
    { value: location.capacityOfPersons, label: 'Guests', icon: Users, color: 'bg-blue-100 text-blue-800' },
    { value: location.propertyDetails?.bedrooms, label: 'Bedrooms', icon: Bed, color: 'bg-green-100 text-green-800' },
    { value: location.propertyDetails?.bathrooms || 1, label: 'Bathrooms', icon: Bath, color: 'bg-yellow-100 text-yellow-800' },
  ].filter(detail => detail.value);

  // --- START OF UI ---

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50 pt-20 font-inter">
      {/* Fixed Header: Name and Actions (Visible on scroll) */}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Main Title and Meta */}
        <div className="mb-6">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2 leading-tight">
            {location.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            {reviewsLoading ? (
              <div className="flex items-center gap-1 text-gray-500">
                <Star size={16} className="text-gray-300" />
                <span className="font-semibold">Loading ratings...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 font-semibold">
                {renderStars(Math.round(averageRating))}
                <span className="ml-1 text-gray-900">{averageRating.toFixed(1)}</span>
                <span className="mx-1 text-gray-400">·</span>
                <button 
                  onClick={() => navigate(`/location/${id}/reviews`)}
                  className="underline hover:text-gray-700 transition-colors"
                >
                  {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                </button>
              </div>
            )}
            <span className="text-gray-400">·</span>
            <div className="flex items-center gap-1">
                <MapPin size={16} className="text-gray-400" />
                <span className="underline">
                    {location.address?.city ?? 'Location TBD'}
                </span>
            </div>
            
            {/* Share/Save buttons in title bar */}
            <div className="ml-auto flex items-center gap-2">
                <button className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-gray-200 transition-colors text-gray-700 text-sm font-medium">
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
                <button className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-gray-200 transition-colors text-gray-700 text-sm font-medium">
                  <Heart size={16} />
                  <span>Save</span>
                </button>
            </div>
          </div>
        </div>

        {/* Images Section */}
        <ImageGallery locationId={id} images={images} />
        
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          
          {/* LEFT SECTION - Details and Info */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* 1. Property Summary & Badges */}
            <div className="pb-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {location.propertyDetails?.nightStay ? 'Farmhouse Night Stay' : 'Exclusive Day Picnic Spot'} hosted by Owner
              </h2>
              
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                {propertyDetails.map((detail, index) => (
                    <div key={index} className={`flex items-center gap-2 px-3 py-1 rounded-full ${detail.color}`}>
                        <detail.icon size={16} className="flex-shrink-0" />
                        <span>{detail.value} {detail.label}</span>
                    </div>
                ))}
              </div>
            </div>

            {/* 2. Highlights */}
            <div className="pb-6 border-b border-gray-200 space-y-5">
              <h3 className="font-semibold text-xl mb-4 text-gray-900">Key Highlights</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                  
                {/* Highlight 1: Check-in */}
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <CheckCircle size={24} className={`mt-1 flex-shrink-0 ${PRIMARY_COLOR_CLASS}`} />
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-900">Smooth Check-in</h4>
                    <p className="text-sm text-gray-600">
                      {totalReviews > 0 
                        ? `${recommendedPercentage}% of guests gave the check-in process a 5-star rating.`
                        : "Guests consistently rate our check-in process 5 stars."
                      }
                    </p>
                  </div>
                </div>

                {/* Highlight 2: Timings */}
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <Clock size={24} className={`mt-1 flex-shrink-0 ${PRIMARY_COLOR_CLASS}`} />
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-900">Timings</h4>
                    <p className="text-sm text-gray-600">
                      Check-in 10:00 AM · Checkout next day 10:00 AM (For night stay)
                    </p>
                  </div>
                </div>

                {/* Highlight 3: Address */}
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm sm:col-span-2">
                  <MapPin size={24} className={`mt-1 flex-shrink-0 ${PRIMARY_COLOR_CLASS}`} />
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-900">Location Address</h4>
                    <p className="text-sm text-gray-600">
                      {location.address?.line1 ?? 'Address unavailable'}{location.address?.line2 && `, ${location.address.line2}`}{location.address?.city && `, ${location.address.city}`}{location.address?.state && `, ${location.address.state}`}{location.address?.pincode && ` - ${location.address.pincode}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Description */}
            <div className="pb-6 border-b border-gray-200">
              <h3 className="font-semibold text-2xl mb-4 text-gray-900">About this Place</h3>
              <div className="space-y-4">
                <p 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: sanitizeHTML(location.description || 'No description available.') 
                  }}
                />
              </div>
            </div>

            {/* 4. Amenities */}
            <div className="pb-6 border-b border-gray-200">
              <h3 className="font-semibold text-2xl mb-6 text-gray-900">What this place offers</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {amenities.map((amenity, idx) => {
                  const IconComponent = amenity.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3 py-2">
                      <IconComponent size={20} className={`text-gray-700 flex-shrink-0 ${PRIMARY_COLOR_CLASS}`} />
                      <span className="text-gray-800 font-medium">{amenity.name}</span>
                    </div>
                  );
                })}
              </div>
              <button className={`text-sm font-semibold underline ${PRIMARY_COLOR_CLASS} hover:text-[#0066a8] transition-colors`}>
                  Show all {amenities.length} amenities
              </button>
            </div>

            {/* 5. Calendar Section */}
            <div className="pb-6 border-b border-gray-200">
              <h3 className="font-semibold text-2xl mb-6 text-gray-900">Select Your Dates</h3>
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
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear dates
                </button>
              </div>
            </div>
            
            {/* 6. Reviews Section */}
            <ReviewSection
              reviews={reviews}
              expandedReviews={expandedReviews}
              onToggleReviewExpansion={toggleReviewExpansion}
              locationId={id}
            />

            {/* 7. Map Section */}
            {location && (
              <LocationMap location={location} />
            )}
          </div>

          {/* RIGHT SECTION - Booking Card (Sticky) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-2xl p-6 transition-shadow hover:shadow-3xl">
                
                {/* Booking Header (MODIFIED: PRICE REMOVED) */}
                <div className="flex items-center justify-center mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-gray-900 mr-2">
                      Check Availability
                    </span>
                  </div>
                  {totalReviews > 0 && (
                      <div className="flex items-center text-sm font-semibold ml-auto">
                          {renderStars(Math.round(averageRating))}
                          <span className="ml-1 text-gray-800">{averageRating.toFixed(1)}</span>
                      </div>
                  )}
                </div>

                {/* Date & Guest Inputs */}
                <div className="border border-gray-300 rounded-xl overflow-hidden mb-4">
                  <div className="grid grid-cols-2">
                    <div className="border-r border-gray-300 p-3 hover:bg-gray-50 transition-colors">
                      <div className="text-xs font-semibold text-gray-700 mb-1">CHECK-IN</div>
                      <div className="font-medium text-gray-900">
                        {checkInDate ? formatDate(checkInDate) : 'Select date'}
                      </div>
                    </div>
                    <div className="p-3 hover:bg-gray-50 transition-colors">
                      <div className="text-xs font-semibold text-gray-700 mb-1">CHECKOUT</div>
                      <div className="font-medium text-gray-900">
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
                </div>

                {/* CTA Button */}
                <button 
                  onClick={handleBookNow}
                  disabled={adults + kids > location.capacityOfPersons || !checkInDate || (location?.propertyDetails?.nightStay && !checkOutDate)}
                  className={`w-full bg-[#008DDA] text-white font-extrabold py-3.5 rounded-xl hover:bg-[#0066a8] transition-all duration-300 mb-4 
                             shadow-lg shadow-blue-200 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {adults + kids > location.capacityOfPersons 
                    ? `Maximum ${location.capacityOfPersons} guests allowed`
                    : 'Reserve Now'
                  }
                </button>

                {/* Capacity Info */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-start gap-3 text-sm">
                    <Gift size={24} className={`${PRIMARY_COLOR_CLASS} flex-shrink-0 mt-1`} />
                    <div>
                      <h4 className="font-semibold mb-1 text-gray-900">Group Size</h4>
                      <p className="text-gray-600">
                        This location accommodates maximum <span className="font-bold">{location.capacityOfPersons} guest{location.capacityOfPersons !== 1 ? 's' : ''}</span>. 
                        Contact us for larger group bookings and special rates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:underline mx-auto">
                  <Flag size={16} />
                  Report this listing
                </button>
              </div>
            </div>
          </div>
        </div>

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