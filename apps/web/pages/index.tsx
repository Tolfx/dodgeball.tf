import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import App from "./App";
import { Colors } from "../utils/constants";

const theme = createTheme({
  // Lets have custom font family for h1,h2,h3,h4,h5,h6
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'tf2build';
        }
      `
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontFamily: "tf2build"
        },
        h2: {
          fontFamily: "tf2build"
        },
        h3: {
          fontFamily: "tf2build"
        },
        h4: {
          fontFamily: "tf2build"
        },
        h5: {
          fontFamily: "tf2build"
        },
        h6: {
          fontFamily: "tf2build"
        }
      }
    }
  },
  transitions: {
    easing: {
      // This is the most common easing curve.
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      // Objects enter the screen at full velocity from off-screen and
      // slowly decelerate to a resting point.
      easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
      // Objects leave the screen at full velocity. They do not decelerate when off-screen.
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      // The sharp curve is used by objects that may return to the screen at any time.
      sharp: "cubic-bezier(0.4, 0, 0.6, 1)"
    }
  },
  // Lets set our custom colors
  palette: {
    mode: "dark",
    primary: {
      main: Colors.BLUE
    },
    secondary: {
      main: Colors.DARK_BLUE
    },
    error: {
      main: Colors.RED
    },
    warning: {
      main: Colors.DARK_ORANGE
    },
    info: {
      main: Colors.BLUE
    },
    success: {
      main: Colors.GREEN
    },
    background: {
      default: Colors.DARK,
      paper: Colors.DARK
    },
    text: {
      primary: "rgba(255, 255, 255, 0.87)"
    }
  }
});

export default function Main() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}
