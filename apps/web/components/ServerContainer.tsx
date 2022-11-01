import { Box, CircularProgress, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import ServerCard from "./ServerCard";

export interface IServerInfoData
{
  name: string;
  map: string;
  maxplayers: number;
  connect: string;
  password: boolean;
  raw: {
    game?: string;
    tags?: string[];
  }
}

export default function ServerContainer()
{

  const [servers, setServers] = useState<IServerInfoData[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isPROD = process.env.NODE_ENV === "production";

  const fetchServers = async () =>
  {
    setIsLoading(true);
    const res = await fetch(`${isPROD ? "https://api.dodgeball.tf" : "http://localhost:3001"}/servers`);
    const data = await res.json();
    setIsLoading(false);
    setServers(data);
  }

  useEffect(() =>
  {
    fetchServers();
  }, []);

  if (isLoading)
  {
    return (
      <Box sx={{
        // display: "flex",
        // alignItems: "center",
      }}>
        {[...Array(50)].map((_, i) =>
        {
          return (
            <Skeleton key={i} variant="rectangular" width={1088} height={212} sx={{
              margin: "2rem"
            }} />
          )
        })}

      </Box>
    )
  }

  return (
    <>
      {servers.map((server, i) =>
      {
        return (
          <ServerCard server={server} key={i} />
        )
      })}
    </>
  );

}