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
    <div className="brand-filter-container">
      <span
        className={`brand-item ${!selectedBrand ? "active" : ""}`}
        onClick={() => onSelect(null)}
      >
        ALL
      </span>

     
      {uniqueBrands.map((brand) => (
        <span
          key={`brand-${brand.id}-${brand.name.replace(/\s+/g, '-')}`} 
          className={`brand-item ${selectedBrand?.id === brand.id ? "active" : ""}`}
          onClick={() => onSelect(brand)}
          title={brand.name} 
        >
          {brand.name}
        </span>
      ))}
    </div>
  );
};

export default BrandFilter;