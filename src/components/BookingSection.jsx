import React from 'react';
import { ArrowRight, CheckCircle, Upload } from 'lucide-react';

import BookingDemo from '../assets/Images/BookingDemo.jpg';

const bookingSteps = [
  { number: "01", title: "Finalize the Location", description: "Choose from our exclusive properties" },
  { number: "02", title: "Check Availability", description: "View real-time availability calendar" },
  { number: "03", title: "Fill the form with easy steps", description: "Simple and secure booking process" },
  { number: "04", title: "Pay token amount for confirmation", description: "Secure your reservation instantly" }
];

const BookingMadeEasy = () => {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-br from-[#f8faf9] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-stretch gap-12 lg:gap-16">
          
          {/* Left Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-12">
            <div>
              <h2 className="text-5xl sm:text-6xl font-serif text-gray-900 leading-tight mb-6">
                Booking Made Easy!
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                You can now book Resort in most easiest way! Just follow the below steps and you are done with your booking.
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-8">
              {bookingSteps.map((step) => (
                <div key={step.number} className="flex gap-6 items-start group">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-[#008DDA] flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-[#008DDA] mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>

            <div className="pt-6">
              <button className="inline-flex items-center gap-2 px-10 py-4 text-lg font-semibold rounded-xl text-white bg-[#008DDA] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                Start Booking Now
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Side - Mobile Video Portrait */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="relative w-full max-w-sm">
              {/* Mobile Frame Mockup */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-900 p-3">
                {/* Video Content Area - Portrait 9:16 ratio */}
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-100">
                  {/* Sample Image/Video Placeholder */}
                  <img 
                    src= {BookingDemo} 
                    alt="Booking process video"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Upload Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer group">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-[#03A791] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-white font-medium text-sm">Click to upload video</p>
                      <p className="text-gray-300 text-xs mt-1">Portrait mode (9:16)</p>
                    </div>
                    <input 
                      type="file" 
                      accept="video/*" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          console.log('Video uploaded:', e.target.files[0].name);
                          // Handle video upload here
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Mobile Notch (Optional - for realistic look) */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10"></div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -z-10 top-8 -right-8 w-64 h-64 bg-[#03A791]/10 rounded-full blur-3xl"></div>
              <div className="absolute -z-10 -bottom-8 -left-8 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BookingMadeEasy;