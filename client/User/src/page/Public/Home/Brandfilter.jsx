import React from 'react';
const BrandFilter = ({ selectedBrand, onSelect }) => {
  const brands = ['ALL', 'Realme', 'Vivo', 'Iphone', 'Samsung', 'Oppo'];
  
  return (
    <div style={{ margin: '20px 0', textAlign: 'center' }}>
      <div style={{ 
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '10px'
      }}>
        {brands.map((brand) => (
          <button
            key={brand}
            onClick={() => onSelect(brand === 'ALL' ? null : brand)}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedBrand === brand ? '#DB4444' : '#f5f5f5',
              color: selectedBrand === brand ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            {brand}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BrandFilter;