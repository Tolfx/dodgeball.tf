import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import App from "./App";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: "tf2build",
  }
});

export default function Main()
{
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}
