import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { Colors } from "../utils/constants";

const FooterContent: FC = () =>
{
  return (
    <>
      <Box sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "2rem",
      }}>
      <Typography variant="h4" component="h6" sx={{
        "@media screen and (max-width: 768px)": {
          fontSize: "1.3rem",
        },
      }}>
        Dodgeball.<span style={{
          color: Colors.ORANGE,
        }}>TF</span> &#x2022; 2022-{new Date().getFullYear()}
      </Typography>
      </Box>
    </>
  )
}

export default FooterContent;