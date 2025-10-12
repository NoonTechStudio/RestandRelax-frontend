import { useState } from 'react';
import { Share2, Heart, Grid3x3, Star, MapPin, Key, Calendar, ShieldCheck, Tag, Flag, ChevronLeft, ChevronRight } from 'lucide-react';

function LocationDetail() {
  const [currentMonth, setCurrentMonth] = useState(0);

  const propertyImages = [
    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2029670/pexels-photo-2029670.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800',
  ];

  const amenities = [
    { icon: '🍴', name: 'Kitchen' },
    { icon: '📶', name: 'Wifi' },
    { icon: '📺', name: 'TV' },
    { icon: '🧺', name: 'Washing machine' },
    { icon: '❄️', name: 'Air conditioning' },
    { icon: '🧳', name: 'Luggage drop-off allowed' },
    { icon: '💨', name: 'Hair dryer' },
    { icon: '🧊', name: 'Fridge' },
    { icon: '📻', name: 'Microwave' },
  ];

  const months = [
    { name: 'November 2025', days: 30, startDay: 5 },
    { name: 'December 2025', days: 31, startDay: 0 },
  ];

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const generateCalendarDays = (month) => {
    const { days, startDay } = month;
    const calendarDays = [];

    for (let i = 0; i < startDay; i++) {
      calendarDays.push(null);
    }

    for (let i = 1; i <= days; i++) {
      calendarDays.push(i);
    }

    return calendarDays;
  };

  const isDateUnavailable = (day) => {
    if (currentMonth === 0) {
      return day >= 6 && day <= 9;
    }
    return false;
  };

  const isDateSelected = (day) => {
    if (currentMonth === 0) {
      return day === 6 || day === 9;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Duplex in central Paris</h1>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Share2 size={16} />
              <span className="text-sm font-medium underline">Share</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Heart size={16} />
              <span className="text-sm font-medium underline">Save</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 gap-2 mb-8 relative">
          <div className="col-span-1 row-span-2">
            <img
              src={propertyImages[0]}
              alt="Property main view"
              className="w-full h-full object-cover rounded-l-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {propertyImages.slice(1).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Property view ${idx + 2}`}
                className={`w-full h-full object-cover ${idx === 1 ? 'rounded-tr-xl' : ''} ${idx === 3 ? 'rounded-br-xl' : ''}`}
              />
            ))}
          </div>
          <button className="absolute bottom-4 right-4 bg-white border border-gray-900 px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-sm hover:bg-gray-50 transition-colors">
            <Grid3x3 size={16} />
            Show all photos
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          <div className="lg:col-span-2">
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-2xl font-semibold mb-2">Entire rental unit in Paris, France</h2>
              <p className="text-gray-700 mb-3">4 guests · 1 bedroom · 2 beds · 2 bathrooms</p>
              <div className="flex items-center gap-1">
                <Star size={16} fill="currentColor" />
                <span className="font-semibold">4.87</span>
                <span className="mx-1">·</span>
                <button className="underline font-semibold">23 reviews</button>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex items-start gap-4">
                <img
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Host"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">Hosted by Adam</h3>
                  <p className="text-gray-600">2 years hosting</p>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6 mb-6 space-y-4">
              <div className="flex items-start gap-4">
                <Key size={24} className="mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Exceptional check-in experience</h3>
                  <p className="text-gray-600">Recent guests gave the check-in process a 5-star rating.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin size={24} className="mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Beautiful and walkable</h3>
                  <p className="text-gray-600">Guests say this area is scenic and it's easy to get around.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Calendar size={24} className="mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Free cancellation before 3:00 pm on 7 Oct</h3>
                  <p className="text-gray-600">Get a full refund if you change your mind.</p>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  Some info has been automatically translated.{' '}
                  <button className="underline font-semibold">Show original</button>
                </p>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6 mb-6">
              <nav className="flex gap-8 mb-8">
                <button className="pb-3 border-b-2 border-gray-900 font-medium">Photos</button>
                <button className="pb-3 text-gray-600 hover:text-gray-900">Amenities</button>
                <button className="pb-3 text-gray-600 hover:text-gray-900">Reviews</button>
                <button className="pb-3 text-gray-600 hover:text-gray-900">Location</button>
              </nav>

              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  I travel a lot and this is by far our favorite 'Pied-a-Terre'! Tour Eiffel, Invalides, Champs-Elysées are all within walking distance as are 3 subway lines(M8,M13, RERC)&airport shuttle. Place is fully equipped and has secured glazed windows for privacy and security. PLEASE NOTE: Before renovation, this used to be a shop. This means access is from the STREET ONLY. The street is calm though and glass is secured, making it a calm and welcoming place. 4 is for families only.
                </p>

                <h3 className="font-semibold text-lg pt-4">The space...</h3>

                <button className="border border-gray-900 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Show more
                </button>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="font-semibold text-2xl mb-6">Where you'll sleep</h3>
              <div className="flex gap-4 overflow-x-auto">
                <div className="border border-gray-200 rounded-lg p-4 min-w-[280px]">
                  <img
                    src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"
                    alt="Bedroom"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h4 className="font-medium">Bedroom 1</h4>
                  <p className="text-sm text-gray-600">1 double bed</p>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="font-semibold text-2xl mb-6">What this place offers</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-2">
                    <span className="text-2xl">{amenity.icon}</span>
                    <span className={amenity.name.includes('Carbon') ? 'line-through text-gray-400' : ''}>
                      {amenity.name}
                    </span>
                  </div>
                ))}
              </div>
              <button className="border border-gray-900 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Show all 30 amenities
              </button>
            </div>

            <div className="pb-6">
              <h3 className="font-semibold text-2xl mb-2">3 nights in Paris</h3>
              <p className="text-gray-600 mb-6">6 Nov 2025 - 9 Nov 2025</p>

              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <button
                    onClick={() => setCurrentMonth(Math.max(0, currentMonth - 1))}
                    className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={currentMonth === 0}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex gap-8">
                    <h4 className="font-semibold">{months[0].name}</h4>
                    <h4 className="font-semibold">{months[1].name}</h4>
                  </div>
                  <button
                    onClick={() => setCurrentMonth(Math.min(1, currentMonth + 1))}
                    className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={currentMonth === 1}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  {months.map((month, monthIdx) => (
                    <div key={monthIdx}>
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {daysOfWeek.map((day, idx) => (
                          <div key={idx} className="text-center text-xs font-medium text-gray-600 py-2">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {generateCalendarDays(month).map((day, idx) => (
                          <div key={idx} className="aspect-square flex items-center justify-center">
                            {day ? (
                              <button
                                className={`w-full h-full flex items-center justify-center rounded-full text-sm
                                  ${isDateSelected(day) && monthIdx === 0 ? 'bg-gray-900 text-white font-semibold' : ''}
                                  ${isDateUnavailable(day) && monthIdx === 0 ? 'line-through text-gray-400' : 'hover:border hover:border-gray-900'}
                                  ${!isDateSelected(day) && !isDateUnavailable(day) ? 'text-gray-900' : ''}
                                `}
                              >
                                {day}
                              </button>
                            ) : (
                              <div></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                  <button className="flex items-center gap-2 text-sm font-medium underline">
                    <Calendar size={16} />
                    Clear dates
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div className="border border-gray-200 rounded-xl shadow-lg p-6">
                <div className="grid grid-cols-2 border border-gray-300 rounded-lg mb-4">
                  <div className="border-r border-gray-300 p-3">
                    <div className="text-xs font-semibold text-gray-700 mb-1">CHECK-IN</div>
                    <div className="font-medium">11/6/2025</div>
                  </div>
                  <div className="p-3">
                    <div className="text-xs font-semibold text-gray-700 mb-1">CHECKOUT</div>
                    <div className="font-medium">11/9/2025</div>
                  </div>
                </div>

                <div className="border border-gray-300 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-1">GUESTS</div>
                      <div className="font-medium">3 guests</div>
                    </div>
                    <ChevronRight size={20} />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-red-600 mb-4">
                  <ShieldCheck size={16} />
                  <span>Those dates are not available</span>
                </div>

                <button className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold py-3.5 rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all mb-4">
                  Change dates
                </button>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-start gap-3 text-sm">
                    <Tag size={24} className="text-pink-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Lower price</h4>
                      <p className="text-gray-600">
                        Your dates are ₹2,932 less than the avg. nightly rate of the last 60 days.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:underline mx-auto">
                  <Flag size={16} />
                  Report this listing
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LocationDetail;
