import { Badge, Box, Button, Container, Link, Tooltip, Typography } from "@mui/material";
import Head from "next/head";
import ServerContainer from "../components/ServerContainer";

export default function App()
{
  return (
    <>
      <Head>
        <title>Dodgeball.tf</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="description" content="dodgeball.tf, a website containing every dodgeball server in Team Fortress 2" />
        <meta name="keywords" content="dodgeball.tf,dodgeball,tf2,team fortress 2, tfdb" />
        <meta name="author" content="Tolfx" />
        {/* Meta data about color */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#8650AE" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="https://tolfix.com/" />
        <meta name="twitter:title" content="dodgeball.tf" />
        <meta name="twitter:image" content="/logo.png" />
        <meta name="twitter:description" content="dodgeball.tf, a website containing every dodgeball server in Team Fortress 2" />

        <meta property="og:title" content="dodgeball.tf" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dodgeball.tf/" />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:description" content="dodgeball.tf, a website containing every dodgeball server in Team Fortress 2" />
      </Head>
      <Container>
        {/* My vision, we have a text in the middle saying "dodgeball.tf" with some color on it */}
        {/* We then have a servercontainer */}
        <Typography sx={{
          color: "white",
          fontSize: "100px",
          textAlign: "center",
        }}>
          <Badge anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }} badgeContent={'Beta v0.1.6'} color='primary'>
            <Link href="/" underline="none" color="inherit" sx={{
              "&:hover": {
                color: "#8650AE",
                fontSize: "120px",
                transition: "0.4s",
              },
              transition: "0.4s",
            }}>
              Dodgeball.tf
            </Link>
          </Badge>
        </Typography>
        <Container sx={{
          color: "white",
          textAlign: "center",
        }}>
          <Container sx={{
            "& > *": {
              margin: "20px",
            },
            textAlign: "left",
            border: "1px solid white",
            borderRadius: "10px",
          }}>
            <Button color='primary' sx={{
              fontSize: "24px",
            }}>
              <Link target={'_blank'} href="https://stats.dodgeball.tf/" underline="none" color="inherit">
                Stats
              </Link>
            </Button >
            <Button color='primary' sx={{
              fontSize: "24px",
            }}>
              <Link target={'_blank'} href="https://bans.dodgeball.tf/" underline="none" color="inherit">
                Bans
              </Link>
            </Button>
              <Button sx={{
                fontSize: "24px",
              }}>
                <Link target={'_blank'} href="https://forum.dodgeball.tf/" color="inherit" underline="none">
                  Forums
                </Link>
              </Button>
            <Button sx={{
              fontSize: "24px",
            }}>
              <Link target={'_blank'} href="https://steamcommunity.com/groups/OfficialTFDB" color="inherit" underline="none">
                Steam Group
              </Link>
            </Button>
            <Button sx={{
              fontSize: "24px",
            }}>
              <Link target={'_blank'} href="https://discord.dodgeball.tf" color="inherit" underline="none">
                Discord
              </Link>
            </Button>
            <Button sx={{
              fontSize: "24px",
            }}>
              <Link target={'_blank'} href="https://github.com/Tolfx/dodgeball.tf" color="inherit" underline="none">
                Github
              </Link>
            </Button>
          </Container>
        </Container>
        <Box>
          <ServerContainer />
        </Box>
      </Container>
    </>
  );
}