import { Link, useNavigate } from 'react-router-dom';
import img from '../../../Image/dl.beatsnoop 1.webp';
import { Button, Col, Form, Input, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import Header from '../../private/Header/Header';


export default function Signup() {
  const navigate = useNavigate()
  const {t} =useTranslation()

  const onFinish = (values) => {
    console.log('Success:', values);
    navigate("/signin")
  };

  const onFinishFailed = () => {
    toast.error(t("Enter-complete-Data"))
  };

  return (<>
  <Header />
    <div style={{ padding: "100px 50px" }}>
      <Row align="middle" justify="center" gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24} lg={12} xl={11}>
          <img loading="eager" src={img} alt='Signup Illustration' style={{ width: '100%', height: 'auto', filter: "drop-shadow(0 0 0.75rem #db4444)", borderRadius: "15px" }} />
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={13}>
          <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: "center" }}>
            <h1>{t("CreateAnAccount")}</h1>
            <h3 style={{ marginTop: -5, fontSize: 13, letterSpacing: 1 }}>{t("EnterYourDetailsBelow")}</h3>

            <Form
              style={{ marginTop: 20 }}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                name="Email"
                rules={[{ required: true, message: t("PleaseInputYourEmail") }]}
                validateTrigger="onBlur"
              >
                <Input placeholder={t("Email")}
                  size="middle"
                  bordered={false}
                  style={{ borderBottom: '1px solid #d9d9d9', width: 380, borderRadius: 0, fontSize: 13, letterSpacing: 0.5 }}
                />
              </Form.Item>

              <Form.Item
                name="username"
                rules={[{ required: true, message: t("PleaseInputYourUsername") }]}
                validateTrigger="onBlur"            >
                <Input
                  placeholder={t("UserName")}
                  size="middle"
                  bordered={false}
                  style={{ borderBottom: '1px solid #d9d9d9', width: 380, borderRadius: 0, fontSize: 13, letterSpacing: 0.5 }}
                />
              </Form.Item>

              <Form.Item
                name="MobilePhone"
                rules={[{ required: true, message: t("PleaseInputYourMobilePhone") }]}
                validateTrigger="onBlur"
              >
                <Input
                  placeholder={t("Phone")}
                  size="middle"
                  bordered={false}
                  style={{ borderBottom: '1px solid #d9d9d9', width: 380, borderRadius: 0, fontSize: 13, letterSpacing: 0.5 }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: t("PleaseInputYourPassword") }]}
                validateTrigger="onBlur"            >
                <Input.Password
                  placeholder={t("Password")}
                  size="middle"
                  bordered={false}
                  style={{ borderBottom: '1px solid #d9d9d9', width: 380, borderRadius: 0, fontSize: 13, letterSpacing: 0.5 }}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: 380, height: 50 }}>
                  {t("Submit")}
                </Button>
              </Form.Item>

            </Form>

            <div>
              <p>{t("AlreadyHaveAccount")} <Link style={{ fontWeight: "bold" }} to="/signin">{t("SignIn")}</Link></p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  </>);
}
