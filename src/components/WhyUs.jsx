import React from 'react';
import { Quote } from 'lucide-react';

const TestimonialSection = () => {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl text-gray-900 leading-tight tracking-tight mb-6">
            Why Choose Our Properties?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            You need a getaway that exceeds expectations. That's why we curated exceptional locations to create unforgettable experiences.
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 bg-white rounded-3xl shadow-2xl overflow-hidden p-8 lg:p-12">
            
            {/* Image Section */}
            <div className="w-full lg:w-5/12 flex-shrink-0">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Guest testimonial"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="w-full lg:w-7/12 space-y-6">
              <Quote className="w-12 h-12 text-[#008DDA] opacity-50" />
              
              <blockquote className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 leading-relaxed font-serif">
                "I was skeptical, but this experience completely transformed the way I think about luxury travel. The properties are so beautifully curated and the locations are absolutely breathtaking. I can't imagine booking anywhere else."
              </blockquote>
              
              <div className="pt-4">
                <p className="text-xl font-semibold text-gray-900">Michael Chen</p>
                <p className="text-base text-[#008DDA] font-medium">Travel Enthusiast</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid Header */}
        <div className="text-center mb-12">
          <h3 className="text-4xl sm:text-5xl text-gray-900 mb-4">Guest Experiences</h3>
          <p className="text-lg text-gray-600">Here's what our guests are saying</p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Testimonial Card 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              In the realm of luxury getaways, some experiences are just very special. Staying at Misty-Wood was one of them.
            </p>
            <div className="flex items-center gap-4">
              <div>
                <p className="font-semibold text-gray-900">Alexandra Anderson</p>
                <p className="text-sm text-gray-600">Designer at Stellar Co.</p>
              </div>
            </div>
          </div>

          {/* Testimonial Card 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Your expectations will fly sky high. The Mediterranean villa was absolutely stunning and exceeded everything I imagined.
            </p>
            <div className="flex items-center gap-4">
              <div>
                <p className="font-semibold text-gray-900">Raj Kapoor</p>
                <p className="text-sm text-gray-600">Entrepreneur from Mumbai</p>
              </div>
            </div>
          </div>

          {/* Testimonial Card 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              This experience transformed me completely. The mountain retreat offered the perfect balance of adventure and tranquility.
            </p>
            <div className="flex items-center gap-4">
              <div>
                <p className="font-semibold text-gray-900">Sarah Peterson</p>
                <p className="text-sm text-gray-600">Photographer & Explorer</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;