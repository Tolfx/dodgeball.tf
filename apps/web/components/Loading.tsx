import { Box, CircularProgress } from "@mui/material";

export default function Loading()
{
  return (
    <>
      {/* Center */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Loading */}
        <CircularProgress />
      </Box>
    </>
  )
}