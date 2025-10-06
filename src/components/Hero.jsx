import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Importing images
import img1 from '../assets/Images/Hero1.jpeg';
import img2 from '../assets/Images/Hero2.jpeg';
import img3 from '../assets/Images/Hero3.jpeg';
import 'swiper/css';
import 'swiper/css/pagination';

const images = [
  img1,
  img2,
  img3
];

const Hero = () => {
  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center bg-white overflow-hidden">
      {/* Title section with animation */}
      <motion.div
        className="w-full text-center py-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        <h1 className="text-6xl md:text-9xl lg:text-10xl mt-10 font-serif text-black  tracking-tight leading-none">
          Discover Peace
        </h1>
      </motion.div>

      {/* Image Swiper section with refined animation */}
      <motion.div
        className="w-[90%] md:w-[80%] lg:w-[70%] max-w-6xl rounded-2xl shadow-4xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      >
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{
            clickable: true,
            bulletActiveClass: 'swiper-pagination-bullet-active bg-white',
            bulletClass: 'swiper-pagination-bullet bg-gray-400'
          }}
          className="w-full h-[500px] md:h-[600px] lg:h-[700px]"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <div className="flex justify-center bg-[#03A791]">
                <img
                  src={src}
                  alt={`Resort view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  );
};

export default Hero;