import { Box, Button } from "@mui/material";
import { FC, useState } from "react";
import { Colors } from "../utils/constants";

const ButtonStyle = {
  color: `${Colors.ORANGE}`,
  backgroundColor: `${Colors.DARKER_DARK}`,
  "&:hover": {
    backgroundColor: `${Colors.DARKER_DARK}aa`
  },
  padding: "0",
  paddingLeft: "5px",
  paddingRight: "5px",
  marginRight: "2px",
  marginLeft: "2px",
  borderRadius: "2px 2px 0 0"
};

enum Pages {
  Home,
  Updates,
  News
}

const RenderPage: FC<{ page: Pages }> = ({ page }) => {
  return {
    [Pages.Home]: <>Home.. coming soon!</>,
    [Pages.Updates]: <>Updates.. coming soon!</>,
    [Pages.News]: <>News.. coming soon!</>
  }[page];
};

const MainContent: FC = () => {
  const [page, setPage] = useState(Pages.Home);

  return (
    <>
      <Box
        sx={{
          // Our parent is positioned relative
          // We want to be positioned absolute
          // And move up a little
          marginTop: "1rem",
          position: "absolute",
          top: "-40px"
        }}
      >
        {/* Lets have some buttons that will render different pages */}
        <Button sx={ButtonStyle} onClick={() => setPage(Pages.Home)}>
          Home
        </Button>
        <Button sx={ButtonStyle} onClick={() => setPage(Pages.Updates)}>
          Updates
        </Button>
        <Button sx={ButtonStyle} onClick={() => setPage(Pages.News)}>
          News
        </Button>
      </Box>
      <Box>
        <RenderPage page={page} />
      </Box>
    </>
  );
};

export default MainContent;
