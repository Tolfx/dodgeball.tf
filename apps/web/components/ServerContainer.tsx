import { Autocomplete, Box, CircularProgress, Skeleton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
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
  const [server, setServer] = useState<IServerInfoData>();

  const [isLoading, setIsLoading] = useState(true);

  const [highlightedServers, setHighlightedServers] = useState<IServerInfoData[] | undefined>();
  const [highlightCache, setHighlightCache] = useState<string[]>([]);

  const isPROD = process.env.NODE_ENV === "production";

  useEffect(() =>
  {
    const queryParams = new URLSearchParams(window.location.search);
    const getHighlight = queryParams.get("highlight");
    if (getHighlight)
    {
      // Get the server from the connect
      const [ip, port] = getHighlight.split(":");
      const server = servers.find(s => s.connect === `${ip}:${port}`);
      setServer(server);
    }
  }, [servers])

  useEffect(() =>
  {
    const queryParams = new URLSearchParams(window.location.search);
    const getHighlights = queryParams.get("highlights");
    if (getHighlights)
    {
      const highServers = getHighlights.split(",");
      const s = highServers.map(s =>
      {
        const [ip, port] = s.split(":");
        return servers.find(s => s.connect === `${ip}:${port}`);
      });
      // Filter out undefined
      // @ts-ignore
      setHighlightedServers(s.filter(s => s));
    }
  }, [servers])

  const fetchServers = async () =>
  {
    setIsLoading(true);
    const res = await fetch(`${isPROD ? "https://api.dodgeball.tf" : "http://localhost:3001"}/servers`);
    const data = await res.json();
    setIsLoading(false);
    setServers(data);
  }

  const getServerCount = () =>
  {
    if (server) return 1;
    if (highlightedServers) return highlightedServers.length;
    return servers.length;
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
      <Box sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        margin: "2rem"
      }}>
        <Autocomplete
          freeSolo
          fullWidth
          options={servers.map((server) => server.name)}
          renderInput={(params) => (
            <TextField {...params} label="Search" margin="normal" variant="outlined" />
          )}
          value={server?.name || ''}
          onChange={(e, value) =>
          {
            const server = servers.find((server) => server.name === value);
            // Only render the server if it exists
            if (server)
            {
              setServer(server);
            }
            else
            {
              setServer(undefined);
            }
          }}

        />
        <Typography variant="h6" sx={{
          marginLeft: "1rem",
          alignItems: 'left',
          justifyContent: 'left',
        }}>
          {/* Server count here */}
          Server count: {getServerCount()}
        </Typography>
      </Box>
      {(!server) && (!highlightedServers) && servers.map((server, i) =>
      {
        return (
          <ServerCard server={server} key={i} highlightCache={highlightCache} setHighlightCache={setHighlightCache} />
        )
      })}
      {(server) && (!highlightedServers) && <ServerCard server={server} highlight={true} highlightCache={highlightCache} setHighlightCache={setHighlightCache} />}
      {(!server) && (highlightedServers) && highlightedServers.map((server, i) =>
      {
        return (
          <ServerCard server={server} key={i} highlight={true} highlightCache={highlightCache} setHighlightCache={setHighlightCache} />
        )
      })}
    </>
  );

}