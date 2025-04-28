import { Link, useNavigate } from "react-router-dom";
import img from "../../../Image/dl.beatsnoop 1.webp";
import { Button, Col, DatePicker, Form, Input, Row } from "antd";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import Header from "../../private/Header/Header";
import { ApiAuth } from "../Api";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";

export default function Signup() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [widthPage, setWidthPage] = useState(window.innerWidth <= 992);

  console.log(widthPage);

  const onFinish = async (values) => {
    const Register = await ApiAuth().Register(values);
    console.log("Success:", Register);
    navigate("/signin");
  };

  const onFinishFailed = () => {
    toast.error(t("Enter-complete-Data"));
  };

  useEffect(() => {
    const handleResize = () => setWidthPage(window.innerWidth <= 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Header />
      <div style={{ padding: "100px 50px" }}>
        <Row align="middle" justify="center" gutter={[16, 16]}>
          {!widthPage ? (
            <Col xs={24} sm={24} md={24} lg={12} xl={11}>
              <img
                loading="eager"
                src={img}
                alt="Signup Illustration"
                style={{
                  width: "100%",
                  height: "auto",
                  filter: "drop-shadow(0 0 0.75rem #db4444)",
                  borderRadius: "15px"
                }}
              />
            </Col>
          ) : (
            ""
          )}

          <Col xs={24} sm={24} md={24} lg={12} xl={13}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <h1>{t("CreateAnAccount")}</h1>
              <h3 style={{ marginTop: -5, fontSize: 13, letterSpacing: 1 }}>
                {t("EnterYourDetailsBelow")}
              </h3>

              <Form
                style={{ marginTop: 20 }}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: t("PleaseInputYourEmail") }
                  ]}
                  validateTrigger="onBlur"
                >
                  <Input
                    placeholder={t("Email")}
                    size="middle"
                    bordered={false}
                    style={{
                      borderBottom: "1px solid #d9d9d9",
                      width: 380,
                      borderRadius: 0,
                      fontSize: 13,
                      letterSpacing: 0.5
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: t("PleaseInputYourUsername") }
                  ]}
                  validateTrigger="onBlur"
                >
                  <Input
                    placeholder={t("UserName")}
                    size="middle"
                    bordered={false}
                    style={{
                      borderBottom: "1px solid #d9d9d9",
                      width: 380,
                      borderRadius: 0,
                      fontSize: 13,
                      letterSpacing: 0.5
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="fullName"
                  rules={[
                    { required: true, message: t("PleaseInputYourUsername") }
                  ]}
                  validateTrigger="onBlur"
                >
                  <Input
                    placeholder={t("UserName")}
                    size="middle"
                    bordered={false}
                    style={{
                      borderBottom: "1px solid #d9d9d9",
                      width: 380,
                      borderRadius: 0,
                      fontSize: 13,
                      letterSpacing: 0.5
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="phoneNumber"
                  rules={[
                    { required: true, message: t("PleaseInputYourMobilePhone") }
                  ]}
                  validateTrigger="onBlur"
                >
                  <Input
                    placeholder={t("Phone")}
                    size="middle"
                    bordered={false}
                    style={{
                      borderBottom: "1px solid #d9d9d9",
                      width: 380,
                      borderRadius: 0,
                      fontSize: 13,
                      letterSpacing: 0.5
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: t("PleaseInputYourPassword") }
                  ]}
                  validateTrigger="onBlur"
                >
                  <Input.Password
                    placeholder={t("Password")}
                    size="middle"
                    bordered={false}
                    style={{
                      borderBottom: "1px solid #d9d9d9",
                      width: 380,
                      borderRadius: 0,
                      fontSize: 13,
                      letterSpacing: 0.5
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  rules={[
                    { required: true, message: t("PleaseInputYourPassword") }
                  ]}
                  validateTrigger="onBlur"
                >
                  <Input.Password
                    placeholder={t("Password")}
                    size="middle"
                    bordered={false}
                    style={{
                      borderBottom: "1px solid #d9d9d9",
                      width: 380,
                      borderRadius: 0,
                      fontSize: 13,
                      letterSpacing: 0.5
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="birthday"
                  rules={[
                    { required: true, message: t("PleaseSelectYourBirthday") }
                  ]}
                  validateTrigger="onBlur"
                >
                  <DatePicker
                    placeholder={t("EnterYourBirthday")}
                    size="middle"
                    bordered={false}
                    style={{
                      borderBottom: "1px solid #d9d9d9",
                      width: 380,
                      borderRadius: 0,
                      fontSize: 13,
                      letterSpacing: 0.5
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="bio"
                  rules={[
                    { required: false, message: t("bio") }
                  ]}
                  validateTrigger="onBlur"
                >
                  <TextArea
                    placeholder={t("bio")}
                    size="middle"
                    bordered={false}
                    style={{
                      borderBottom: "1px solid #d9d9d9",
                      width: 380,
                      borderRadius: 0,
                      fontSize: 13,
                      letterSpacing: 0.5
                    }}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: 380, height: 50 }}
                  >
                    {t("Submit")}
                  </Button>
                </Form.Item>
              </Form>

              <div>
                <p>
                  {t("AlreadyHaveAccount")}{" "}
                  <Link style={{ fontWeight: "bold" }} to="/signin">
                    {t("SignIn")}
                  </Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}
