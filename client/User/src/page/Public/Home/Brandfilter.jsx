import React from "react";
import "./BrandFilter.css";

const BrandFilter = ({ brands = [], selectedBrand, onSelect }) => {
    const uniqueBrandsMap = new Map();
    brands.forEach(brand => {
        if (brand && brand.id && brand.name && !uniqueBrandsMap.has(brand.id)) {
            uniqueBrandsMap.set(brand.id, brand);
        }
    });
    const uniqueBrands = Array.from(uniqueBrandsMap.values());

    return (
        <div className="enhanced-brand-filter">
            <div className="filter-header">
                <h3 className="filter-title">Filter by Brand</h3>
                <span className="filter-count">{uniqueBrands.length} brands available</span>
            </div>
            
            <div className="brand-filter-container">
                <button
                    className={`brand-pill ${!selectedBrand ? "active" : ""}`}
                    onClick={() => onSelect(null)}
                >
                    <span className="brand-text">All Brands</span>
                    {!selectedBrand && <span className="active-indicator"></span>}
                </button>

                {uniqueBrands.map((brand) => (
                    <button
                        key={`brand-${brand.id}-${brand.name.replace(/\s+/g, '-')}`}
                        className={`brand-pill ${selectedBrand?.id === brand.id ? "active" : ""}`}
                        onClick={() => onSelect(brand)}
                        title={brand.name}
                    >
                        <span className="brand-text">{brand.name}</span>
                        {selectedBrand?.id === brand.id && <span className="active-indicator"></span>}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BrandFilter;

