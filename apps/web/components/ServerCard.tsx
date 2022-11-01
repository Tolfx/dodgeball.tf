import { Button, Card, CardActions, CardContent, CircularProgress, Paper, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { IServerInfoData } from "./ServerContainer";

interface Props
{
  server: IServerInfoData;
}

interface player
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
    fetchAdditionInfo();
  }, []);

  return (
    <>
      <Card sx={{
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
              </Typography>
            </>}
          </Typography>
        </CardContent>
        <CardActions>
          <Button href={`steam://connect/${server.connect}`} color='success'>
            Connect
          </Button>
        </CardActions>
      </Card>
    </>
  )

}