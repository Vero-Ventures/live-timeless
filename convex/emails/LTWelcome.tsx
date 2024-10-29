import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Img,
  Button,
} from "@react-email/components";

interface LTWelcomeProps {
  email: string;
  name: string;
}

export default function LTWelcome({
  email = "example@acme.com",
  name = "Yaniv Talmor",
}: LTWelcomeProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Live Timeless</Preview>
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
              <Text style={mainText}>Hello {name},</Text>
              <Text style={validityText}>
                We're thrilled to have you join our wellness platform. Get ready
                to take control and empower your employees on their journey to
                better health and well-being!
              </Text>
              <Text style={validityText}>
                You're credentials to login to the admin dashboard is below:
              </Text>
              <Section>
                <Section>
                  <Text style={codeText}>Email: {email}</Text>
                </Section>
                <Section
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Button style={button} href={`${process.env.DASHBOARD_URL}/`}>
                    Login to Admin Dashboard
                  </Button>
                </Section>
              </Section>
            </Section>
          </Section>
          <Text style={footerText}>
            This message was produced and distributed by Live Timeless. ©{" "}
            {new Date().getFullYear()}, Live Timeless, Inc.. All rights
            reserved. Live Timeless is a registered trademark of{" "}
            <Link href="https://livetimeless.com/" target="_blank" style={link}>
              Live Timeless
            </Link>
            , Inc. View our{" "}
            <Link
              href="https://livetimeless.com/privacy-policy/"
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

const coverSection = { backgroundColor: "#fff" };

const upperSection = { padding: "25px 35px" };

const footerText = {
  ...text,
  fontSize: "12px",
  padding: "0 20px",
};

const codeText = {
  ...text,
  fontWeight: "bold",
  fontSize: "16px",
  margin: "20px 0px 40px",
  textAlign: "center" as const,
};

const validityText = {
  ...text,
  margin: "0px",
  marginBottom: "16px",
  textAlign: "left" as const,
};

const mainText = { ...text, marginBottom: "16px" };

const button = {
  backgroundColor: "#0f2336",
  borderRadius: "3px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "11px 23px",
  width: "380px",
};
