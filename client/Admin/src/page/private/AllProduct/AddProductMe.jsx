import { useParams } from "react-router-dom";
import { Form, Input, Button, Select, Upload, Row, Col, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { ApiData } from "./Api";
import toast from "react-hot-toast";
const { Option } = Select;

export default function AddProductMe() {
  const { id } = useParams() || null;
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [product, setProduct] = useState({});
  const [form] = Form.useForm();
  const idUser = localStorage.getItem("userId");

  const getCategories = async () => {
    try {
      const Data = await ApiData().getCategories();
      setCategories(Data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getBrands = async () => {
    try {
      const Data = await ApiData().getBrands();
      setBrands(Data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const GetProductById = async () => {
    try {
      const Data = await ApiData().GetProductById(id);
      setProduct(Data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCategories();
    getBrands();
    if (id) {
      GetProductById();
    }
  }, []);

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product?.name,
        categoryId: product?.categories?.[0]?.id,
        brandId: product?.brand?.id,
        bio: product?.bio,
        price: product?.productProviders?.[0]?.salePrice,
        stock: product?.productProviders?.[0]?.countInStock
      });
    }
  }, [product]);

  const onFinish = async (values) => {
    console.log(values);

    if (!id) {
      try {
        await ApiData().AddProductMe({
          name: values.name,
          productProviders: [
            {
              provider: {
                id: idUser
              },
              countInStock: values.stock,
              salePrice: values.price
            }
          ],

          categories: [
            {
              id: values.categoryId
            }
          ],
          brand: {
            id: values.brandId
          },
          bio: values.bio
        });
        toast.success(t("Success"));
      } catch (err) {
        toast.error(err.response.data.message);
      }
    } else {
      try {
        await ApiData().UpdateProductMe(
          {
            countInStock: parseInt(values.stock),
            salePrice: parseInt(values.price)
          },
          id
        );
        toast.success(t("Success"));
      } catch (err) {
        toast.error(err.response.data.message);
      }
    }
  };

  const test = async (files) => {
    const file = files.file;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await ApiData().AddImg(formData, id);
      toast.success(t("UploadSuccess"));
      console.log("Image uploaded successfully", response);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(t("UploadFailed"));
    }
  };
  const onFinishFailed = (errorInfo) => {
    toast.error(t("Enter-complete-Data"));
  };

  return (
    <>
      <Card
        title={id ? t("update") : t("AddProduct")}
        bordered={false}
        style={{
          maxWidth: 900,
          margin: "auto",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          borderRadius: 12
        }}
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          form={form}
        >
          <Row gutter={16}>
            <Col xs={24} span={12}>
              <Form.Item
                label={t("ProductName")}
                name="name"
                rules={[{ required: true, message: t("RequiredProductName") }]}
              >
                <Input
                  placeholder={t("EnterProductName")}
                  disabled={product?.name || id ? true : false}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("Category")}
                name="categoryId"
                rules={[{ required: true, message: t("RequiredCategory") }]}
              >
                <Select
                  placeholder={t("SelectCategory")}
                  disabled={product?.categories?.[0]?.id || id ? true : false}
                >
                  {categories.map((cat) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("Brand")}
                name="brandId"
                rules={[{ required: true, message: t("RequiredBrand") }]}
              >
                <Select
                  placeholder={t("SelectBrand")}
                  disabled={product?.brand?.id || id ? true : false}
                >
                  {brands.map((brand) => (
                    <Option key={brand.id} value={brand.id}>
                      {brand.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("Price")}
                name="price"
                rules={[{ required: true, message: t("RequiredPrice") }]}
              >
                <Input type="number" placeholder={t("EnterPrice")} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("Stock")}
                name="stock"
                rules={[{ required: true, message: t("RequiredStock") }]}
              >
                <Input type="number" placeholder={t("EnterStock")} />
              </Form.Item>
            </Col>

            <Col xs={24} span={12}>
              <Form.Item
                label={t("descriptionProduct")}
                name="bio"
                rules={[{ required: false, message: t("descriptionProduct") }]}
              >
                <Input
                  type="text"
                  placeholder={t("descriptionProduct")}
                  disabled={product?.bio || id ? true : false}
                />
              </Form.Item>
            </Col>
            {id ? (
              <Col span={12}>
                <Form.Item
                  label={t("Image")}
                  name="image"
                  valuePropName="file"
                  rules={[{ required: false, message: t("RequiredImage") }]}
                >
                  <Upload
                    beforeUpload={() => false}
                    maxCount={1}
                    onChange={(el) => test(el)}
                  >
                    <Button icon={<UploadOutlined />}>
                      {t("UploadImage")}
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            ) : (
              ""
            )}
          </Row>

          <Form.Item style={{ textAlign: "end", marginTop: 24 }}>
            <Button type="primary" htmlType="submit">
              {id ? t("update") : t("AddProduct")}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
