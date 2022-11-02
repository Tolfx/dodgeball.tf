import { Badge, Box, Container, Link, Typography } from "@mui/material";
import Head from "next/head";
import ServerContainer from "../components/ServerContainer";
import GitHubIcon from '@mui/icons-material/GitHub';

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
          }} badgeContent={'Beta v0.0.4'} color='primary'>
            Dodgeball.tf
          </Badge>
        </Typography>
        <Container sx={{
          color: "white",
          textAlign: "center",
        }}>
          {/* Let's have github icon of source code */}
          <Typography sx={{
            color: "white",
            textAlign: "right",
          }}>
            <Link href="https://github.com/Tolfx/dodgeball.tf" color="inherit" underline="none">
              <GitHubIcon sx={{
                color: "white",
                fontSize: "50px",
              }} />
            </Link>
          </Typography>
        </Container>
        <Box>
          <ServerContainer />
        </Box>
      </Container>
    </>
  );
}