import { Card } from "antd";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();
const imageUrl = product.imageUrl ;

  const handleClick = () => {
    navigate(`/products/${product.id}`); 
  };

  return (
    <Card
      hoverable
      onClick={handleClick}
      style={{
        width: 220,
        height: 320,
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: "10px",
        cursor: "pointer",
      }}
      bodyStyle={{ padding: "10px", textAlign: "center" }}
      cover={
        <div
          style={{
            backgroundColor: "#f5f5f5",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 180,
            width: "100%",
            overflow: "hidden",
          }}
        >
          <img
            alt={product.name}
            src={imageUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      }
    >
      <h3 style={{ fontWeight: "bold", fontSize: "1rem", margin: "8px 0" }}>
        {product.name}
      </h3>
      <p style={{ color: "#DB4444", fontWeight: "bold", fontSize: "1rem" }}>
        ${product.price}
      </p>
    </Card>
  );
}

export default ProductCard;