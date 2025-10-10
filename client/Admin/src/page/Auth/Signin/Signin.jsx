import { useNavigate } from "react-router-dom";
import { Button, Col, Form, Input, Row } from "antd";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import Header from "../../private/Header/Header";
import { ApiAuth } from "../Api";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../../Redux/Auth";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Signin() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [widthPage, setWidthPage] = useState(window.innerWidth <= 992);
  const sliceAuthToken = useDispatch();
  const [loading, setLoading] = useState(false);

  const onFinish = async (data) => {
    const loginResponse = await ApiAuth().Login(data);
    setLoading(true);

    if (loginResponse.status === 404 || loginResponse.status === 401) {
      toast.error(loginResponse.error);
      setLoading(false);

      return;
    }

    const token = loginResponse.data?.token;
    const user = loginResponse.data?.user;
     localStorage.setItem("userId", user?.id);
    if (token) {
      localStorage.setItem("userToken", token);
      sliceAuthToken(setToken(token));
      toast.success(t("Success"));
      navigate("/AllProduct");
      setLoading(false);
    } else {
      setLoading(false);
      navigate("/Signin");
      toast.error(loginResponse.error);
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
      <div style={{ padding: "50px 50px" }}>
        <Row align="middle" justify="center">
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px"
              }}
            >
              <h1>{t("LogintoExclusive")}</h1>
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
                  name="password"
                  rules={[
                    { required: true, message: t("PleaseInputYourPassword") },
                    { min: 6, message: t("PasswordMinLength") }
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
                <p style={{ color: "rgba(219, 68, 68, 1)" }}>
                  {t("ForgetPassword")}
                </p>
              </div>
            </div>
          </Col>
          {!widthPage ? (
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <DotLottieReact
                src="https://lottie.host/8d200b25-694c-4833-9191-c8053c59394c/MGlOPim2qB.lottie"
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
