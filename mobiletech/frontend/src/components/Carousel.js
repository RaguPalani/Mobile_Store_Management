import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Carousel.css'; // Custom styles for the carousel

const Carousel = () => {
  // Sample data for featured products
  const products = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      image: 'https://t-mobile.scene7.com/is/image/Tmusprod/Samsung_Galaxy-S25-Series_Lockup_Logo-AI-blk-fg_750x750-1%3A1x1?ts=1737439289418&fmt=png-alpha&qlt=85,0&resMode=sharp2&op_usm=1.75,0.3,2,0&dpr=off',
      price: '$999',
    },
    {
      id: 2,
      name: '',
      image: 'https://techarc.net/wp-content/uploads/2024/01/OnePlus-12-Techarc-1024x576.png',
      price: '',
    },
    {
      id: 3,
      name: '',
      image: 'https://www.androidheadlines.com/wp-content/uploads/2023/10/Google-Pixel-8-ad-featured-image-1-jpg.webp',
      price: '',
    },
    {
      id: 4,
      name: 'OnePlus 11',
      image: 'https://static.toiimg.com/thumb/msid-116252294,width-1070,height-580,imgsize-32754,resizemode-75,overlay-toi_sw,pt-32,y_pad-40/photo.jpg',
      price: '$699',
    },
    {
      id: 5,
      name: 'Xiaomi 13 Pro',
      image: 'https://www.telecoalert.com/wp-content/uploads/2021/05/Infinix-NOTE10-Pro-launched-with-Flagship-MediaTek-Helio-G95-and-90Hz-display-1.png',
      price: '$749',
    },
  ];

  return (
    <div className="carousel-container">
      <Swiper
        slidesPerView={1} // Show 1 slide at a time
        spaceBetween={10} // Space between slides
        loop={true} // Infinite loop
        autoplay={{
          delay: 3000, // Auto-slide every 3 seconds
          disableOnInteraction: false, // Continue autoplay after user interaction
        }}
        pagination={{
          clickable: true, // Enable clickable pagination dots
        }}
        navigation={true} // Enable navigation arrows
        modules={[Autoplay, Pagination, Navigation]}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              {/* <h3 className="product-name">{product.name}</h3>
              <p className="product-price">{product.price}</p> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;