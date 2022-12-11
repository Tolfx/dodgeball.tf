import { Box, Container, Typography } from "@mui/material";
import Head from "next/head";
import DonationPerk from "../components/DonationPerk";
import { Colors } from "../utils/constants";

const PerksSupporter = [
  "[Supporter] Tag in-game, discord & forum",
  "Tag color",
  "Name color",
  "Chat color",
  "Reserved slot",
  "Customizable join message",
  "Resize your hands up to x2.5",
  "Resize your head up to x2.5",
  "Resize your torso up to x2.5",
  "Become a robot 🤖",
  "Become a skeleton 💀",
];

const PerksPatron = [
  "Permanent Supporter perks for life",
  "Patron tag in-game, discord & forum",
  "Personalized tag in-game (one time)"
];

export default function App()
{
  return (
    <>
      <Head>
        <title>Donations | Dodgeball.tf</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="description" content="Donation website for supporting dodgeball.tf" />
        <meta name="keywords" content="dodgeball.tf,dodgeball,tf2,team fortress 2, tfdb" />
        <meta name="author" content="Tolfx" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Meta data about color */}
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#FE902E" />
        <meta name="msapplication-TileColor" content="#FE902E" />
        <meta name="theme-color" content="#FE902E" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="https://tolfix.com/" />
        <meta name="twitter:title" content="dodgeball.tf" />
        <meta name="twitter:image" content="/logo.png" />
        <meta name="twitter:description" content="Donation website for supporting dodgeball.tf" />

        <meta property="og:title" content="dodgeball.tf" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dodgeball.tf/" />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:description" content="Donation website for supporting dodgeball.tf" />
      </Head>
      <Container>
        <Box sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "2rem",
        }}>
          <Typography variant="h2" component="h1">
            Donations | Dodgeball.<span style={{
              color: Colors.ORANGE,
            }}>TF</span>
          </Typography>
        </Box>
        <Box sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          marginTop: "2rem",
        }}>
          <DonationPerk
            heading="Supporter"
            price={2.5}
            perks={PerksSupporter}
            id="supporter"
            isMonthly={true}
          />
          <DonationPerk
            heading="Patron"
            price={25}
            perks={PerksPatron}
            id="patron"
            isPermanent={true}
          />
        </Box>

      </Container>
    </>
  )
}
