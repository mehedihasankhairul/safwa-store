"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import "swiper/css";

const Banner = () => {
  const slides = [
    {
      href: "",
      src: "https://ikhlasstore.com/wp-content/uploads/2023/05/Iman-Porichorja-Web-Banner-1-scaled.jpg",
    },
    {
      href: "",
      src: "https://ikhlasstore.com/wp-content/uploads/2021/11/ssssz-1290x260.jpg",
    },
    {
      href: "",
      src: "https://ikhlasstore.com/wp-content/uploads/2021/08/3-6-scaled.jpg",
    },
    {
      href: "",
      src: "https://ikhlasstore.com/wp-content/uploads/2021/08/4-5-scaled.jpg",
    },
    {
      href: "",
      src: "https://ikhlasstore.com/wp-content/uploads/2023/02/banner-1290x260.jpg",
    },
    {
      href: "",
      src: "https://ikhlasstore.com/wp-content/uploads/2021/08/6-5-scaled.jpg",
    },
    {
      href: "",
      src: "https://ikhlasstore.com/wp-content/uploads/2021/08/1-6-scaled.jpg",
    },
  ];

  return (
    <section className="home-banner-section">
      <div className=" mx-auto">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]} // Corrected usage
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop
          className="rounded-lg overflow-hidden"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <a href={slide.href}>
                <img
                  src={slide.src}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-auto"
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Banner;
