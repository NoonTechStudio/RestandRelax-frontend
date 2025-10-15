import { X, CheckCircle, Calendar, User, Phone, MapPin, Utensils, Star, Shield, Clock } from 'lucide-react';
import { formatDate } from '../../utils/locations/locationUitls';
import { useState, useEffect } from 'react';

const BookingModal = ({ 
  showBookingModal, 
  setShowBookingModal, 
  bookingForm, 
  onInputChange, 
  onSubmit, 
  checkInDate, 
  checkOutDate, 
  adults, 
  kids, 
  location 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_CONNECTION_HOST;

  // Fetch booked dates when modal opens
  useEffect(() => {
    if (showBookingModal && location?._id) {
      fetchBookedDates();
      // Reset confirmation state when modal opens
      setBookingConfirmed(false);
      setBookingData(null);
    }
  }, [showBookingModal, location]);

  const fetchBookedDates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/dates/${location._id}`);
      const result = await response.json();
      if (result.success) {
        setBookedDates(result.bookedDates);
      }
    } catch (error) {
      console.error('Error fetching booked dates:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare booking data
      const bookingPayload = {
        locationId: location._id,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
        name: bookingForm.name,
        phone: bookingForm.phone,
        address: bookingForm.address,
        adults: adults,
        kids: kids,
        withFood: bookingForm.food,
        pricing: {
          totalPrice: calculateTotalPrice()
        }
      };

      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });

      const result = await response.json();

      if (result.success) {
        setBookingConfirmed(true);
        setBookingData(result.booking);
        await fetchBookedDates();
      } else {
        alert(result.error || 'Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotalPrice = () => {
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const basePrice = location?.basePrice || 1000;
    const foodCharge = bookingForm.food ? (adults + kids) * 500 * nights : 0;
    return (basePrice * nights) + foodCharge;
  };

  const getBookedDatesInfo = () => {
    const bookedInSelection = bookedDates.filter(booked => {
      const bookedDate = new Date(booked.date);
      return bookedDate >= checkInDate && bookedDate < checkOutDate;
    });

    if (bookedInSelection.length > 0) {
      const paidBookings = bookedInSelection.filter(b => b.status === 'paid');
      const pendingBookings = bookedInSelection.filter(b => b.status === 'pending');
      
      return {
        hasConflict: true,
        paidCount: paidBookings.length,
        pendingCount: pendingBookings.length
      };
    }

    return { hasConflict: false, paidCount: 0, pendingCount: 0 };
  };

  const bookingConflict = getBookedDatesInfo();

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setBookingConfirmed(false);
    setBookingData(null);
  };

  // Confirmation View
  if (bookingConfirmed && bookingData) {
    return (
      <div className="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-auto transform transition-all duration-300 scale-100">
          <div className="p-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-100 rounded-full animate-ping"></div>
                  <CheckCircle className="h-24 w-24 text-green-500 relative z-10" />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                Booking Confirmed!
              </h3>
              
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Your booking has been successfully submitted. We'll contact you shortly to confirm the details.
              </p>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-6 text-left">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-semibold bg-green-100 px-3 py-1 rounded-lg text-green-800">#{bookingData._id?.slice(-8)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{location.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-medium">{formatDate(checkInDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-medium">{formatDate(checkOutDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-green-600 text-xl">₹{calculateTotalPrice().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original Booking Form View
  if (!showBookingModal) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-auto transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-white to-gray-50 rounded-t-3xl">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Complete Booking</h3>
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              {location.rating || '4.8'} • {location.name}
            </p>
          </div>
          <button 
            onClick={handleCloseModal}
            className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
          >
            <X size={20} className="text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Booking Conflict Warning */}
          {bookingConflict.hasConflict && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-amber-800 font-semibold text-sm mb-1">
                    Date Availability Notice
                  </h4>
                  <p className="text-amber-700 text-sm">
                    Some dates in your selection may be booked. We'll confirm availability within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h4>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={bookingForm.name}
                        onChange={onInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={bookingForm.phone}
                        onChange={onInputChange}
                        required
                        pattern="[0-9]{10}"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="10-digit number"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address *
                      </label>
                      <textarea
                        name="address"
                        value={bookingForm.address}
                        onChange={onInputChange}
                        required
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                        placeholder="Enter your complete address"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <input
                      type="checkbox"
                      name="food"
                      checked={bookingForm.food}
                      onChange={onInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Utensils size={16} className="text-blue-600" />
                      Include food service (+₹500 per person per day)
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Shield size={20} />
                        Confirm Booking
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Booking Summary
                </h4>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-blue-100">
                    <span className="text-gray-600">Dates</span>
                    <span className="font-semibold text-right">
                      {formatDate(checkInDate)} - {formatDate(checkOutDate)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-blue-100">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold">
                      {Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))} nights
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-blue-100">
                    <span className="text-gray-600">Guests</span>
                    <span className="font-semibold">
                      {adults + kids} {adults + kids === 1 ? 'person' : 'people'}
                    </span>
                  </div>

                  {bookingForm.food && (
                    <div className="flex justify-between items-center pb-3 border-b border-blue-100">
                      <span className="text-gray-600">Food Service</span>
                      <span className="font-semibold text-green-600">Included</span>
                    </div>
                  )}

                  <div className="pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Base Price</span>
                      <span>₹{(location?.basePrice || 1000) * Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))}</span>
                    </div>
                    {bookingForm.food && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Food Charges</span>
                        <span>₹{(adults + kids) * 500 * Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-blue-600">₹{calculateTotalPrice().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Secure Booking</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700">Confirmation within 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;