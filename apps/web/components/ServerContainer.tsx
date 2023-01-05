import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ServerCard from "./ServerCard";
import Loading from "./Loading";

export interface IServerInfoData {
  name: string;
  map: string;
  maxplayers: number;
  connect: string;
  password: boolean;
  raw: {
    game?: string;
    tags?: string[];
  };
}

export default function ServerContainer() {
  const [servers, setServers] = useState<IServerInfoData[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isPROD = process.env.NODE_ENV === "production";

  const fetchServers = async () => {
    setIsLoading(true);
    const res = await fetch(
      `${isPROD ? "https://api.dodgeball.tf" : "http://localhost:3001"}/servers`
    );
    const data = await res.json();
    setIsLoading(false);
    setServers(data);
  };

  useEffect(() => {
    fetchServers();
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          margin: "2rem"
        }}
      >
        <Typography variant="h3">Our community servers</Typography>
      </Box>
      {isLoading && <Loading />}
      {!isLoading &&
        servers.map((server, i) => <ServerCard server={server} key={i} />)}
    </>
  );
}
