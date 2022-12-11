import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { FC } from "react";
import { Colors } from "../utils/constants";

interface DonationPerkProps {
  heading: string;
  perks: string[];
  price: number;
  isMonthly?: boolean;
  isPermanent?: boolean;
  id: string;
};

const DonationPerk: FC<DonationPerkProps> = (props) => {
  return (
    <Card sx={{
      width: "100%",
      maxWidth: "500px",
      margin: "1rem",
    }}>
      <CardContent sx={{
          textAlign: "center",
          backgroundColor: Colors.DARK_ORANGE,
        }}>
        <Typography variant="h3" component="h1">
          {props.heading}
        </Typography>
      </CardContent>
      <CardContent sx={{
          textAlign: "center",
          backgroundColor: Colors.ORANGE,
        }}>
        <Typography variant="h3" component="h1">
          ${props.price}/{props.isMonthly ? "month" : props.isPermanent ? "life" : "one-time"}
        </Typography>
      </CardContent>
      <CardContent>
        {/* Table of the perks */}
        <Typography variant="h5" component="h2">
          Perks
        </Typography>
        <ul>
          {/* On each we want a check mark */}
          {props.perks.map((perk, index) => (
            <li key={index}>
              {perk}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardActions sx={{
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
      }}>
        <Button disabled sx={{
          color: 'white',
          backgroundColor: Colors.ORANGE,
          '&:hover': {
            backgroundColor: Colors.DARK_ORANGE,
          },
        }}>
            Click to get started
        </Button>
      </CardActions>
    </Card>
  )
};

export default DonationPerk;