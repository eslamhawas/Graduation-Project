import { Link, useNavigate } from "react-router-dom";
import { Button, Col, DatePicker, Form, Input, Row } from "antd";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import Header from "../../private/Header/Header";
import { ApiAuth } from "../Api";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Signup() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [widthPage, setWidthPage] = useState(window.innerWidth <= 992);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      await ApiAuth().Register(values);
      toast.success("Success");
      navigate("/signin");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
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
      <div style={{ padding: "0px 0px" }}>
        <Row align="middle" justify="center">
          
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width:"100%"
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
                    { required: true, message: t("PleaseInputYourEmail") },
                    { type: "email", message: t("InvalidEmail") }
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
                    { required: true, message: t("PleaseInputYourFullName") }
                  ]}
                  validateTrigger="onBlur"
                >
                  <Input
                    placeholder={t("FullName")}
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
                    {
                      required: true,
                      message: t("PleaseInputYourMobilePhone")
                    },
                    {
                      pattern: /^[0-9]{10,15}$/,
                      message: t("InvalidPhoneNumber")
                    }
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
                    { required: true, message: t("PleaseInputYourPassword") },
                    {
                      min: 6,
                      message: t("PasswordMinLength")
                    }
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
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: t("PleaseInputYourConfirmPassword")
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(t("PasswordsDoNotMatch"))
                        );
                      }
                    })
                  ]}
                  validateTrigger="onBlur"
                >
                  <Input.Password
                    placeholder={t("confirmPassword")}
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
                    placeholder={t("Birthday")}
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

                <Form.Item name="bio" validateTrigger="onBlur">
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
                    {loading ? (
                      <DotLottieReact
                        src="https://lottie.host/19cd0886-c31d-4b82-8781-8daee8c5011c/ysC4VCy63L.lottie"
                        loop
                        autoplay
                      />
                    ) : (
                      t("Submit")
                    )}
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
          {!widthPage ? (
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={12}
              xl={12}
              style={{ marginBottom: "80px" }}
            >
              <DotLottieReact
                src="https://lottie.host/77c70991-1b3a-4c85-aebf-d7bf40415e40/Rq3JSIlkEP.lottie"
                loop
                autoplay
              />
            </Col>
          ) : (
            ""
          )}

        </Row>
      </div>
    </>
  );
}
