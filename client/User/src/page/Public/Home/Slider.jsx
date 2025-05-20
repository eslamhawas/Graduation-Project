import React from 'react';
import { Carousel } from 'antd';
import { useNavigate } from 'react-router-dom';

import slide1 from "../../../Image/pixlr-image-generator-60418798-c7b9-43d9-a3eb-de2d2dfa40bb.png"
import slide2 from "../../../Image/pixlr-image-generator-c5491c9d-d0c1-4542-b032-051d5230b89e.png"
import slide3 from "../../../Image/freepik__an-overhead-shot-of-headphones-neatly-arranged-on-__14701.jpeg"
import slide4 from "../../../Image/freepik__a-playstation-commercial-showing-a-light-red-contr__14702.jpeg"
function Slider() {
    const navigate = useNavigate();
    const handleClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <div className="Slider" style={{ width: '100%', overflow: 'hidden' }}>
      <Carousel autoplay dotPosition="bottom">
        <div onClick={() => handleClick('3')} style={{ cursor: 'pointer' }}>
         <img
            src={slide1}
            alt="Slide 1"
            style={{ width: '100%', height: '400px', objectFit: 'cover' }}
          />
        </div>
        <div  onClick={() => handleClick('4')} style={{ cursor: 'pointer' }}>
         <img
            src={slide2}
            alt="Slide 2"
            style={{ width: '100%', height: '400px', objectFit: 'cover' }}
          />
        </div>
        <div  onClick={() => handleClick('5')} style={{ cursor: 'pointer' }}>
         <img
            src={slide3}
            alt="Slide 3"
            style={{ width: '100%', height: '400px', objectFit: 'cover' }}
          />
        </div>
        
        <div  onClick={() => handleClick('6')} style={{ cursor: 'pointer' }}>
         <img
            src={slide4}
            alt="Slide 4"
            style={{ width: '100%', height: '400px', objectFit: 'cover' }}
          />
        </div>
      </Carousel>
    </div>
  );
}

export default Slider;
