import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";

export default function HomeSwiper() {
    return (
        <div id="app" className="h-auto flex justify-center mt-5">
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 7500,
                    disableOnInteraction: false,
                }}
                speed={1500}
                modules={[Autoplay, Pagination, Navigation]}
                className="swiper w-[99%] h-auto rounded-lg my-2"
            >
                <SwiperSlide className="swiper-slide flex justify-center items-center">
                    <img 
                        src="/marketing2.png"
                        alt="Home Slide 1" 
                        className="w-full h-auto object-contain rounded-lg" 
                    />
                </SwiperSlide>
                <SwiperSlide className="swiper-slide flex justify-center items-center">
                    <img 
                        src="/marketing1.png"
                        alt="Home Slide 2" 
                        className="w-full h-auto object-contain rounded-lg" 
                    />
                </SwiperSlide>
            </Swiper>
        </div>
    );
}