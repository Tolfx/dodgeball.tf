import { Button, Card, CardActions, CardContent, Collapse, IconButton, IconButtonProps, Skeleton, styled, Typography } from "@mui/material";
import CachedIcon from '@mui/icons-material/Cached';
import React, { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import useOnScreen from "../hooks/useOnScreen";
import { IServerInfoData } from "./ServerContainer";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HighlightIcon from '@mui/icons-material/Highlight';
import PlayersTable from "./PlayersTable";

interface Props
{
  server: IServerInfoData;
  highlight?: boolean;
  setHighlightCache: Dispatch<SetStateAction<string[]>>;
  highlightCache: string[];
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

interface ExpandMoreProps extends IconButtonProps
{
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) =>
{
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ServerCard({ server, highlight, highlightCache, setHighlightCache }: Props)
{
  const [additionInfo, setAdditionInfo] = useState<fullServerInfo>();
  const ref = React.useRef<HTMLDivElement>(null);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [isHighlighted, setIsHighlighted] = useState(highlight || false);
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
        margin: "2rem",
        border: isHighlighted ? "2px solid #FED801" : "none",
      }}>
        <CardContent>
          <Typography component={'span'} variant="h5">
            {server.name}
          </Typography>
          <Typography >
            <Typography component={'span'} color="gray">
              {server.raw.tags?.join(", ")}
            </Typography>
          </Typography>
          <Typography component={'span'}>
            {!additionInfo ? <Skeleton /> : <>
              <Typography variant="h5">
                Map: {additionInfo.map}
              </Typography>
            </>}
          </Typography>
          <Typography component={'span'}>
            {!additionInfo ? <Skeleton /> : <>
              <Typography component={'span'} variant="h5">
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
          <Button
            sx={{
              marginLeft: "auto"
            }}
            onClick={() =>
            {
              setIsHighlighted(!isHighlighted)
              if (!isHighlighted)
              {
                // Set to local storage
                setHighlightCache([...highlightCache, server.connect]);
                const cache = [...highlightCache, server.connect]
                // Check if we got more than 1
                if (cache.length === 1)
                {
                  const host = window.location.host;
                  navigator.clipboard.writeText(`${host}/?highlight=${server.connect}`);
                }
                else
                {
                  const host = window.location.host;
                  // Use highlightedServers to make a link
                  const text = `${host}/?highlights=${cache.join(",")}`;
                  navigator.clipboard.writeText(text);
                }
              }
              else
              {
                // remove from local storage and remove from url
                setHighlightCache(highlightCache.filter((s) => s !== server.connect));
                const host = window.location.host;
                const text = `${host}/?highlights=${highlightCache.join(",")}`;
                navigator.clipboard.writeText(text);
              }
            }}
            title="Highlight"
          >
            <HighlightIcon />
          </Button>
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