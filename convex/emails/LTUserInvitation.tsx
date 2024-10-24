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

interface LTInvitationProps {
  name: string;
  owner: string;
  org: string;
}

export default function LTInvitation({
  name = "John Doe",
  org = "Vero Ventures",
  owner = "Yaniv Talmor",
}: LTInvitationProps) {
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
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {owner}
                </span>{" "}
                has invited you to join{" "}
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {org}
                </span>{" "}
                on Live Timeless - your gateway to workplace wellness and
                personal growth.
              </Text>

              <Text style={validityText}>What you'll get access to:</Text>
              <ul style={featureList}>
                <li>Powerful Habit Tracking Features</li>
                <li>Wellness challenges and activities</li>
                <li>Personalized AI wellness advisor</li>
                <li>Health tracking tools</li>
              </ul>
              <Section>
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
                  <Button style={button} href="https://livetimeless.com/">
                    Accept Invitation
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

const validityText = {
  ...text,
  margin: "0px",
  marginBottom: "16px",
  textAlign: "left" as const,
};

const mainText = { ...text, marginBottom: "14px" };

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

const featureList = {
  marginBottom: "40px",
  gap: 8,
  fontSize: "16px",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Open Sans', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};
