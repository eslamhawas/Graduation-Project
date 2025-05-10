import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Categories from './Categories';
import ProductCard from './ProductCard';
import BrandFilter from './BrandFilter'; 
import axiosInstance from "../../../Api/Axios";
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const CategoryProducts = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsResponse = await axiosInstance.get(
          `http://localhost:4100/api/products?categoryId=${id}`
        );
        setProducts(productsResponse.data.data);
        
        const uniqueBrands = [...new Set(
          productsResponse.data.data.map(product => product.brand)
        )];
        setBrands(uniqueBrands);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  useEffect(() => {
    if (selectedBrand) {
      setFilteredProducts(products.filter(product => product.brand === selectedBrand));
    } else {
      setFilteredProducts(products);
    }
  }, [selectedBrand, products]);

  const handleBrandSelect = (brand) => {
    setSelectedBrand(selectedBrand === brand ? null : brand);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
     
      <div style={{ marginBottom: '20px' }}>
        <Categories />
      </div>

     
      {brands.length > 0 && (
        <BrandFilter 
          brands={brands}
          selectedBrand={selectedBrand}
          onSelect={handleBrandSelect}
        />
      )}

     
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
          {(filteredProducts.length > 0 ? filteredProducts : products).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {filteredProducts.length === 0 && selectedBrand && (
          <p style={{ textAlign: 'center' }}>No products available for this brand.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;