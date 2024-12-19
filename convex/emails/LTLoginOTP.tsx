import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Img,
} from "@react-email/components";

interface LTLoginOTPProps {
  otp?: string;
}

export default function LTLoginOTP({ otp = "12345678" }: LTLoginOTPProps) {
  return (
    <Html>
      <Head />
      <Preview>Sign in to Live Timeless</Preview>
      <Body style={main}>
        <Section style={imageSection}>
          <Img
            src="https://livetimeless.kinde.com/logo?p_org_code=&cache=87d0180cfefd442ba2ac41f75fc3e542"
            alt="Live Timeless's Logo"
            style={logo}
          />
        </Section>
        <Container style={container}>
          <Section style={coverSection}>
            <Section style={upperSection}>
              <Text style={mainText}>
                To complete your sign-in, please use the following One-Time
                Password (OTP):
              </Text>
              <Section style={verificationSection}>
                <Section style={codeContainer}>
                  <Text style={codeText}>{otp}</Text>
                </Section>
                <Text style={validityText}>
                  This OTP will expire in 15 minutes. If you didn't request this
                  code, please ignore this email.
                </Text>
                <Text style={validityText}>
                  For your security, please do not share this code with anyone.
                </Text>
              </Section>
            </Section>
            <Hr />
            <Section style={lowerSection}>
              <Text style={cautionText}>
                Live Timeless will never email you and ask you to disclose or
                verify your password, credit card, or banking account number.
              </Text>
            </Section>
          </Section>
          <Text style={footerText}>
            This message was produced and distributed by Live Timeless. ©{" "}
            {new Date().getFullYear()}, Live Timeless, Inc.. All rights
            reserved. Live Timeless is a registered trademark of{" "}
            <Link
              href="https://live-timeless.vercel.app/"
              target="_blank"
              style={link}
            >
              Live Timeless
            </Link>
            , Inc. View our{" "}
            <Link
              href="https://live-timeless.vercel.app/privacy-policy"
              target="_blank"
              style={link}
            >
              privacy policy
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#fff",
  color: "#212121",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const link = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Open Sans', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "16px",
  textDecoration: "underline",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Open Sans', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "16px",
  margin: "24px 0",
};

const imageSection = {
  backgroundColor: "#0f2336",
  padding: "20px 20px",
};

const logo = { margin: "0 auto" };

const codeContainer = {
  background: "rgba(0,0,0,.05)",
  borderRadius: "4px",
  margin: "20px auto 40px",
  verticalAlign: "middle",
  width: "280px",
};
const coverSection = { backgroundColor: "#fff" };

const upperSection = { padding: "25px 35px" };

const lowerSection = { padding: "25px 35px" };

const footerText = {
  ...text,
  fontSize: "12px",
  padding: "0 20px",
};

const codeText = {
  ...text,
  fontWeight: "bold",
  fontSize: "36px",
  margin: "20px 0px 20px",
  textAlign: "center" as const,
  textDecoration: "none",
};

const validityText = {
  ...text,
  margin: "0px",
  marginBottom: "16px",
  textAlign: "left" as const,
};

const verificationSection = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const mainText = { ...text, marginBottom: "16px" };

const cautionText = { ...text, margin: "0px" };
