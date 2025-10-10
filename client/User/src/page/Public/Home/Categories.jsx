import {useEffect, useState} from 'react';
import {Badge, Dropdown, Menu, Spin} from 'antd';
import {
    HomeOutlined,
    LaptopOutlined,
    MenuOutlined,
    MobileOutlined,
    ShoppingOutlined,
    SkinOutlined,
    SmileOutlined,
    TrophyOutlined
} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import "./Categories.css";
import axiosInstance from "../../../Api/Axios";

const Categories = () => {
    const [visible, setVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axiosInstance.get("/nest/api/category");
                const result = response.data;

                const data = Array.isArray(result) ? result : result.data || [];

                setCategories(data);

            } catch (err) {
                console.error("Error fetching categories:", err);
                setError(err.message || "Failed to fetch categories");
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const getCategoryIcon = (categoryName) => {
        const iconMap = {
            'Mega Summer Sale': <ShoppingOutlined />,
            'Mobile Phones': <MobileOutlined />,
            'Electronics': <LaptopOutlined />,
            'Fashion': <SkinOutlined />,
            'Appliances': <HomeOutlined />,
            'Video Games': <TrophyOutlined />,
            'Prime - Home': <HomeOutlined />,
            'Toys & Games': <TrophyOutlined />,
            'Grocery': <ShoppingOutlined />,
            'Perfumes': <SmileOutlined />
        };

        return iconMap[categoryName] || <ShoppingOutlined />;
    };

    const handleCategoryClick = (categoryId) => {
        navigate(`/category/${categoryId}`);
        setVisible(false);
    };

    const handleHomeClick = () => {
        navigate('/Home');
        setVisible(false);
    };

    const menu = (
        <Menu className="enhanced-category-dropdown">
            <Menu.ItemGroup title="Browse Categories" className="dropdown-header">
                <Menu.Item
                    key="home"
                    icon={<HomeOutlined />}
                    onClick={handleHomeClick}
                    className="dropdown-item"
                >
                    <span>Home</span>
                </Menu.Item>

                {Array.isArray(categories) && categories.map((category) => (
                    <Menu.Item
                        key={category.id}
                        icon={getCategoryIcon(category.name)}
                        onClick={() => handleCategoryClick(category.id)}
                        className="dropdown-item"
                    >
                        <span>{category.name}</span>
                    </Menu.Item>
                ))}
            </Menu.ItemGroup>
        </Menu>
    );

    if (loading) {
        return (
            <div className="enhanced-category-navigation">
                <div className="loading-state">
                    <Spin size="small" />
                    <span>Loading categories...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="enhanced-category-navigation">
                <div className="error-state">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="enhanced-category-navigation">
            <div className="category-navbar">
                <Dropdown
                    overlay={menu}
                    visible={visible}
                    onVisibleChange={setVisible}
                    placement="bottomLeft"
                    trigger={['click']}
                >
                    <div className="all-categories-toggle">
                        <MenuOutlined className="menu-icon" />
                        <span className="toggle-text">All Categories</span>
                        <div className="toggle-indicator"></div>
                    </div>
                </Dropdown>

                <div className="category-links">
                    <div
                        className="category-link-item home-link"
                        onClick={handleHomeClick}
                    >
                        <div className="category-link-content">
                            <HomeOutlined className="category-icon" />
                            <span className="category-name">Home</span>
                        </div>
                        <div className="link-underline"></div>
                    </div>

                    {Array.isArray(categories) && categories.slice(0, 6).map((category) => (
                        <div
                            key={category.id}
                            className="category-link-item"
                            onClick={() => handleCategoryClick(category.id)}
                        >
                            {category.badge ? (
                                <Badge.Ribbon text="LIVE" color="#DB4444" className="category-badge">
                                    <div className="category-link-content">
                                        {getCategoryIcon(category.name)}
                                        <span className="category-name">{category.name}</span>
                                    </div>
                                </Badge.Ribbon>
                            ) : (
                                <div className="category-link-content">
                                    {getCategoryIcon(category.name)}
                                    <span className="category-name">{category.name}</span>
                                </div>
                            )}
                            <div className="link-underline"></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sale-banner">
                <div className="sale-banner-content">
                    <div className="sale-info">
                        <h2 className="sale-title">Mega Summer Sale</h2>
                        <div className="sale-dates">27-31 May</div>
                    </div>
                    <div className="sale-status">
                        <span className="status-dot"></span>
                        Sale is LIVE
                    </div>
                </div>
                <div className="banner-decoration"></div>
            </div>
        </div>
    );
};

export default Categories;

