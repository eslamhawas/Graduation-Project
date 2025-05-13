import { useEffect, useState } from "react";
import { Row, Col, Spin, Typography } from "antd";
import axiosInstance from "../../../Api/Axios";
import ProductCard from "./ProductCard";

const { Title } = Typography;

const FilteredProducts = ({ categoryId, selectedBrand }) => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState(["ALL"]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!categoryId) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("http://localhost:4100/api/products", {
          params: { categoryId, status: "ACCEPTED" },
        });

        const all = Array.isArray(res.data) ? res.data : res.data.data || [];
        setProducts(all);
        setBrands(["ALL", ...new Set(all.map((p) => p.brand))]);
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts([]);
        setBrands(["ALL"]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const filtered = selectedBrand === "ALL"
    ? products
    : products.filter((product) => product.brand === selectedBrand);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
              <ProductCard product={product} />
            </Col>
          ))
        ) : (
          <Col span={24} style={{ textAlign: "center" }}>
            <Title level={4}>No products found</Title>
          </Col>
        )}
      </Row>
    </>
  );
};

export default FilteredProducts;
