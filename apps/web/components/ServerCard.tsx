import { Button, Card, CardActions, CardContent, Collapse, Skeleton, Typography } from "@mui/material";
import CachedIcon from '@mui/icons-material/Cached';
import React from "react";
import { useEffect, useState } from "react";
import useOnScreen from "../hooks/useOnScreen";
import Loading from "./Loading";
import { IServerInfoData } from "./ServerContainer";
import { ExpandMore } from "@mui/icons-material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayersTable from "./PlayersTable";

interface Props
{
  server: IServerInfoData;
}

export interface player
{
  name: string;
  raw: {
    score: number;
    time: number;
  }
}

interface fullServerInfo extends IServerInfoData
{
  password: boolean;
  players: player[];
  bots: player[];
}

export default function ServerCard({ server }: Props)
{
  const [additionInfo, setAdditionInfo] = useState<fullServerInfo>();
  const ref = React.useRef<HTMLDivElement>(null);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const isVisable = useOnScreen(ref);
  const isPROD = process.env.NODE_ENV === "production";

  const fetchAdditionInfo = async () =>
  {
    const [ip, port] = server.connect.split(":");
    const res = await fetch(`${isPROD ? "https://api.dodgeball.tf" : "http://localhost:3001"}/servers/serverinfo/${ip}/${port}`);
    const data = await res.json();
    setAdditionInfo(data);
  }

  useEffect(() =>
  {
    if (isVisable && !hasBeenVisible)
    {
      fetchAdditionInfo();
      setHasBeenVisible(true);
    }
  }, [isVisable]);

  return (
    <>
      <Card ref={ref} sx={{
        margin: "2rem"
      }}>
        <CardContent>
          <Typography variant="h5">
            {server.name}
          </Typography>
          <Typography >
            <Typography color="gray">
              {server.raw.tags?.join(", ")}
            </Typography>
          </Typography>
          <Typography >
            {!additionInfo ? <Skeleton /> : <>
              <Typography variant="h5">
                Map: {additionInfo.map}
              </Typography>
            </>}
          </Typography>
          <Typography >
            {!additionInfo ? <Skeleton /> : <>
              <Typography variant="h5">
                Players: {additionInfo?.players?.length}/{additionInfo?.maxplayers}
                {/* @ts-ignore */}
                <ExpandMore
                  expand={expanded}
                  onClick={() => setExpanded(!expanded)}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <PlayersTable players={additionInfo.players} />
                </Collapse>
              </Typography>
            </>}
          </Typography>
        </CardContent>
        <CardActions>
          <Button href={`steam://connect/${server.connect}`} color='success'>
            Connect
          </Button>
          {/* Have timeout on right */}
          <Button
            sx={{
              marginLeft: "auto"
            }}
            onClick={() => fetchAdditionInfo()}
            title="Refresh"
          >
            <CachedIcon />
          </Button>
        </CardActions>
      </Card>
    </>
  )

}