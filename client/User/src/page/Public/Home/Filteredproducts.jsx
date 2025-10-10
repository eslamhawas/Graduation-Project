import React, { useEffect, useState } from "react";
import axios from "axios";
import BrandFilter from "./BrandFilter";
import ProductList from "./ProductList";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const FilteredProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await axios.get("/nest/api/products");
        const data = res.data?.data || [];
        setProducts(data);
        setFilteredProducts(data);
        const uniqueBrandsMap = new Map();
        data.forEach((product) => {
          if (product.brand && !uniqueBrandsMap.has(product.brand.id)) {
            uniqueBrandsMap.set(product.brand.id, product.brand);
          }
        });

        setBrands([...uniqueBrandsMap.values()]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      setFilteredProducts(
          products.filter((p) => p.brand?.id === selectedBrand.id)
      );
    } else {
      setFilteredProducts(products);
    }
  }, [selectedBrand, products]);

  const handleBrandSelect = (brand) => {
    setSelectedBrand(selectedBrand?.id === brand?.id ? null : brand);
  };

  if (loading) {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: 'center', minHeight: '300px' }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
    );
  }

  return (
      <div style={{ padding: "20px" }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '20px', textAlign: 'center' }}>Filter Products</h2>
        <BrandFilter
            brands={brands}
            selectedBrand={selectedBrand}
            onSelect={handleBrandSelect}
        />
        <ProductList products={filteredProducts} />
        {filteredProducts.length === 0 && selectedBrand && (
            <p style={{ textAlign: 'center', marginTop: '20px', color: '#888' }}>No products available for this brand.</p>
        )}
      </div>
  );
};

export default FilteredProducts;