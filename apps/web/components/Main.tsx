import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { Colors } from "../utils/constants";

const Main: FC = () =>
{
  return (
    <>
      <Box
        sx={{
          marginBottom: "1rem",
        }}
      >
        <Typography variant="h4">
          Welcome to Dodgeball.<span style={{
                color: Colors.ORANGE,
              }}>TF</span>!
        </Typography>
        <Typography variant="h6">
          Dodgeball.<span style={{
            color: Colors.ORANGE,
          }}>TF</span> is a community for the gamemode <span style={{color: Colors.ORANGE}}>Dodgeball</span> in Team Fortress 2, where baller strive. We have community servers where you as the player can play dodgeball!
        </Typography>
      </Box>
    </>
  )
}

export default Main;
