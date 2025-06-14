import React from 'react';
import { Carousel } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import "./Slider.css";

import slide1 from "../../../Image/pixlr-image-generator-60418798-c7b9-43d9-a3eb-de2d2dfa40bb.png"
import slide2 from "../../../Image/pixlr-image-generator-c5491c9d-d0c1-4542-b032-051d5230b89e.png"
import slide3 from "../../../Image/freepik__an-overhead-shot-of-headphones-neatly-arranged-on-__14701.jpeg"
import slide4 from "../../../Image/freepik__a-playstation-commercial-showing-a-light-red-contr__14702.jpeg"

function Slider() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    
    const handleClick = (categoryId) => {
        navigate(`/category/${categoryId}`);
    };

    return (
        <div className="enhanced-slider" style={{ width: '100%', overflow: 'hidden', margin: '24px 0' }}>
            <Carousel 
                autoplay 
                dotPosition="bottom"
                autoplaySpeed={4000}
                speed={800}
                effect="fade"
                className="enhanced-carousel"
            >
                <div onClick={() => handleClick('3')} className="slide-container">
                    <div className="slide-overlay"></div>
                    <img
                        src={slide1}
                        alt="Electronics Collection"
                        className="slide-image"
                    />
                    <div className="slide-content">
                        <h3>{t('home.premium_electronics')}</h3>
                        <p>{t('home.discover_technology')}</p>
                    </div>
                </div>
                <div onClick={() => handleClick('4')} className="slide-container">
                    <div className="slide-overlay"></div>
                    <img
                        src={slide2}
                        alt="Fashion Collection"
                        className="slide-image"
                    />
                    <div className="slide-content">
                        <h3>{t('home.fashion_forward')}</h3>
                        <p>{t('home.style_speaks')}</p>
                    </div>
                </div>
                <div onClick={() => handleClick('5')} className="slide-container">
                    <div className="slide-overlay"></div>
                    <img
                        src={slide3}
                        alt="Audio Collection"
                        className="slide-image"
                    />
                    <div className="slide-content">
                        <h3>{t('home.audio_excellence')}</h3>
                        <p>{t('home.immerse_sound')}</p>
                    </div>
                </div>
                <div onClick={() => handleClick('6')} className="slide-container">
                    <div className="slide-overlay"></div>
                    <img
                        src={slide4}
                        alt="Gaming Collection"
                        className="slide-image"
                    />
                    <div className="slide-content">
                        <h3>{t('home.gaming_paradise')}</h3>
                        <p>{t('home.level_up')}</p>
                    </div>
                </div>
            </Carousel>
        </div>
    );
}

export default Slider;

