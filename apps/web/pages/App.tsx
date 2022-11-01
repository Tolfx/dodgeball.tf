import { Badge, Box, Container, Typography } from "@mui/material";
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
          }} badgeContent={'Beta v0.0.3'} color='primary'>
            Dodgeball.tf
          </Badge>
        </Typography>

        <Box>
          <ServerContainer />
        </Box>
      </Container>
    </>
  );
}