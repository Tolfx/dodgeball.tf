import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faSteam } from "@fortawesome/free-brands-svg-icons";
import {
  faBarChart,
  faBan,
  faHandHoldingDollar,
  faCrown
} from "@fortawesome/free-solid-svg-icons";
import { Box, Card, Link } from "@mui/material";
import React, { FC } from "react";
import { Colors } from "../utils/constants";

interface SocialMediaCardProps {
  name: string;
  icon: JSX.Element;
  link: string;
  color: string;
}

const SocialMediaCard: FC<SocialMediaCardProps> = (props) => {
  const { name, icon, link, color } = props;
  return (
    <>
      {/* Lets have icon at left,
          then name at right
          So if icon is X and name is Y it should be: X Y
          using MUI card
      */}
      <Link
        href={link}
        target="_blank"
        sx={{
          color: "white",
          textDecoration: "none"
        }}
      >
        <Card
          sx={{
            width: "100%",
            backgroundColor: color,
            "&:hover": {
              // On hover, lets take our color and make it a bit darker
              backgroundColor: `${color}aa`
            },
            marginTop: "1rem",
            marginBottom: "1rem"
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              // Make it a bit smaller
              padding: "0.5rem"
            }}
          >
            <Box>{icon}</Box>
            <Box
              sx={{
                marginLeft: "0.5rem"
              }}
            >
              {name}
            </Box>
          </Box>
        </Card>
      </Link>
    </>
  );
};

const ExtraContent: FC = () => {
  return (
    <>
      <SocialMediaCard
        name="Donate"
        icon={<FontAwesomeIcon icon={faHandHoldingDollar} size="2xl" />}
        link="https://donations.dodgeball.tf/"
        color={Colors.DARK_BLUE}
      />
      <SocialMediaCard
        name="Hall Of Fame"
        icon={<FontAwesomeIcon icon={faCrown} size="2xl" />}
        link="https://donations.dodgeball.tf/fame"
        color={Colors.DARK_ORANGE}
      />
      <SocialMediaCard
        name="Discord"
        icon={<FontAwesomeIcon icon={faDiscord} size="2xl" />}
        link="https://discord.dodgeball.tf/"
        color="#6E84D0"
      />
      <SocialMediaCard
        name="Steam Group"
        icon={<FontAwesomeIcon icon={faSteam} size="2xl" />}
        link="https://steamcommunity.com/groups/OfficialTFDB"
        color="#1B2838"
      />
      <SocialMediaCard
        name="Stats"
        icon={<FontAwesomeIcon icon={faBarChart} size="2xl" />}
        link="https://stats.dodgeball.tf/"
        color="#116DB6"
      />
      <SocialMediaCard
        name="Bans"
        icon={<FontAwesomeIcon icon={faBan} size="2xl" />}
        link="https://bans.dodgeball.tf/"
        color="#38322C"
      />
    </>
  );
};

export default ExtraContent;
