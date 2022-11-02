import { Paper, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import { styled } from '@mui/material/styles';
import { player } from "./ServerCard";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

interface Props
{
  players: player[];
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function PlayersTable({ players }: Props)
{
  // Sort players by score
  const sortedPlayers = players.sort((a, b) => b.raw.score - a.raw.score);

  // Table of players
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="right">Score</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedPlayers.map((player) => (
            <StyledTableRow
              key={player.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <StyledTableCell component="th" scope="row">
                {player.name}
              </StyledTableCell>
              <TableCell align="right">{player?.raw?.score ?? 0}</TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}