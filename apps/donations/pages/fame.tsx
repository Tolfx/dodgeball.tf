import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Typography, Link, CircularProgress } from "@mui/material";
import Head from "next/head";
import {  useEffect, useState } from "react"
import { Colors } from "../utils/constants";

interface HallOfFame {
  name: string;
  amount: number;
  steamid: string;
}

export default function Fame()
{

  const IS_PROD = process.env.NODE_ENV === "production";
  const url = IS_PROD ? "https://donate.dodgeball.tf/donator/hall-of-fame" : "http://localhost:3004/donator/hall-of-fame";

  const [fames, setFames] = useState<HallOfFame[]>([]);

  // We want to fetch the hall of fame from the API
  useEffect(() =>
  {
    fetch(url)
      .then((response) => response.json())
      .then((data) =>
      {
        setFames(data);
      })
      .catch((error) =>
      {
        console.error(error);
      });
  }, []);

  return (
    <>
    <Head>
      <title>Hall of Fame | Dodgeball.tf</title>
    </Head>
    <Box sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "2rem",
          marginBottom: "2rem",
        }}>
      <Typography variant="h2" component="h1">
        Hall of fame | Dodgeball.<span style={{
          color: Colors.ORANGE,
        }}>TF</span>
      </Typography>
    </Box>
    {fames.length <= 0 && (
      <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "2rem",
            marginBottom: "2rem",
          }}>
        <CircularProgress
          sx={{
            color: Colors.ORANGE,
          }}
          size={200}
        />
      </Box>
    )}
    {fames.length > 0 && (
    <Container>
      {/* We want to have a table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fames.map((fame) =>
            {
              return (
                <TableRow
                  key={fame.name}
                  // Ensure that tha
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    // Make top 3 a bit more special
                    '&:nth-child(1)': {
                      backgroundColor: '#FED801',
                    },
                    '&:nth-child(2)': {
                      backgroundColor: '#B2B2B2',
                    },
                    '&:nth-child(3)': {
                      backgroundColor: '#CD7F32',
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Link sx={{
                      color: 'white',
                      '&:hover': {
                        color: Colors.DARK_ORANGE,
                      },
                      textDecoration: "none",
                      fontSize: "1.5rem",
                    }} href={`https://steamcommunity.com/profiles/${fame.steamid}`}>
                      {fame.name}
                    </Link>
                  </TableCell>
                  <TableCell align="right" sx={{
                    fontSize: "1.5rem",
                  }}>${fame.amount}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
    )}
    </>
  )
}