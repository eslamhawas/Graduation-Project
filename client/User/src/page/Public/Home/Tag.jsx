import { Tag } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import "./Tag.css";

function ThisMonthTag() {
    return (
        <Tag
            className="enhanced-tag"
            style={{
                background: "linear-gradient(135deg, #DB4444 0%, #FF6B6B 100%)",
                border: "none",
                borderRadius: "16px",
                padding: "12px 20px",
                margin: "24px 40px",
                height: "auto",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 4px 20px rgba(219, 68, 68, 0.25), 0 2px 8px rgba(219, 68, 68, 0.15)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
            }}
            onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px) scale(1.02)";
                e.target.style.boxShadow = "0 8px 32px rgba(219, 68, 68, 0.35), 0 4px 16px rgba(219, 68, 68, 0.25)";
            }}
            onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.boxShadow = "0 4px 20px rgba(219, 68, 68, 0.25), 0 2px 8px rgba(219, 68, 68, 0.15)";
            }}
        >
            <div className="tag-shimmer"></div>
            <CalendarOutlined 
                style={{ 
                    fontSize: "18px", 
                    color: "#fff",
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))"
                }} 
            />
            <span 
                style={{ 
                    color: "#fff", 
                    fontWeight: "600",
                    fontSize: "16px",
                    letterSpacing: "0.5px",
                    textShadow: "0 1px 2px rgba(0,0,0,0.1)"
                }}
            >
                This Month
            </span>
        </Tag>
    );
}

export default ThisMonthTag;

