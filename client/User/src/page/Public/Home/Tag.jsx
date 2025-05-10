import { Tag } from "antd";
import { CalendarOutlined } from "@ant-design/icons";

function ThisMonthTag() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Tag color="#DB4444" style={{ borderRadius: "20%", padding: "5px 7px", margin: "20px 40px" , height: 30  }}>
      </Tag>
      <span style={{ color: "#DB4444", fontWeight: "bold" }}>This Month</span>
    </div>
  );
}

export default ThisMonthTag;