import { Box, Container, Typography } from "@mui/material";
import Head from "next/head";
import ServerContainer from "../components/ServerContainer";
import { Colors } from "../utils/constants";
import MainContent from "../components/MainContent";
import Main from "../components/Main";
import ExtraContent from "../components/ExtraContent";
import FooterContent from "../components/FooterContent";

export default function App() {
  return (
    <>
      <Head>
        <title>Dodgeball.tf</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta
          name="description"
          content="Dodgeball.tf, a community for dodgeball in team fortress 2."
        />
        <meta
          name="keywords"
          content="dodgeball.tf,dodgeball,tf2,team fortress 2, tfdb"
        />
        <meta name="author" content="Tolfx" />
        {/* Meta data about color */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/safari-pinned-tab.svg"
          color={Colors.ORANGE}
        />
        <meta name="msapplication-TileColor" content={Colors.ORANGE} />
        <meta name="theme-color" content={Colors.ORANGE} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="https://tolfix.com/" />
        <meta name="twitter:title" content="Dodgeball.tf" />
        <meta name="twitter:image" content="/logo.png" />
        <meta
          name="twitter:description"
          content="Dodgeball.tf, a community for dodgeball in team fortress 2."
        />

        <meta property="og:title" content="Dodgeball.tf" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dodgeball.tf/" />
        <meta property="og:image" content="/logo.png" />
        <meta
          property="og:description"
          content="Dodgeball.tf, a community for dodgeball in team fortress 2."
        />
      </Head>

      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "2rem"
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              // needs mobile friendly font size
              "@media screen and (max-width: 768px)": {
                fontSize: "3rem"
              }
            }}
          >
            Dodgeball.
            <span
              style={{
                color: Colors.ORANGE
              }}
            >
              TF
            </span>
          </Typography>
        </Box>

        {/* Lets have a grid layout
            1. MAIN MAIN MAIN
            2. CONTENT CONTENT EXTRA
            3. FOOTER FOOTER FOOTER
        */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gridTemplateAreas: `
            "main main extra"
            "content content extra"
            "servers servers servers"
            "footer footer footer"
          `,
            marginTop: "2rem",
            // We also want to ensure it doesn't overflow the page
            maxWidth: "100%",
            // And we want to center it
            margin: "0 auto",
            // Lets make it mobile friendly
            "@media screen and (max-width: 768px)": {
              gridTemplateColumns: "1fr",
              gridTemplateRows: "1fr",
              gridTemplateAreas: `
              "main"
              "content"
              "extra"
              "servers"
              "footer"
            `
            }
          }}
        >
          <Box
            sx={{
              gridArea: "main",
              backgroundColor: Colors.GRAY,
              padding: "1rem",
              // Keep all content in the box
              overflow: "hidden",
              // If it overflows, we want to break the words
              wordBreak: "break-word"
            }}
          >
            <Main />
          </Box>
          <Box
            sx={{
              gridArea: "content",
              backgroundColor: Colors.DARKER_DARK,
              wordBreak: "break-word",
              position: "relative"
            }}
          >
            <MainContent />
          </Box>
          <Box
            sx={{
              gridArea: "extra",
              backgroundColor: Colors.LIGHTER_DARK,
              padding: "1rem",
              // Keep all content in the box
              overflow: "hidden",
              // If it overflows, we want to break the words
              wordBreak: "break-word"
            }}
          >
            <ExtraContent />
          </Box>
          <Box
            sx={{
              gridArea: "servers",
              // backgroundColor: Colors.DARK_BLUE,
              borderRadius: "10px",
              padding: "1rem",
              // Keep all content in the box
              overflow: "hidden",
              // If it overflows, we want to break the words
              wordBreak: "break-word"
            }}
          >
            <ServerContainer />
          </Box>
          <Box
            sx={{
              gridArea: "footer",
              padding: "1rem",
              // Keep all content in the box
              overflow: "hidden",
              // If it overflows, we want to break the words
              wordBreak: "break-word"
            }}
          >
            <FooterContent />
          </Box>
        </Box>
      </Container>
    </>
  );
}
