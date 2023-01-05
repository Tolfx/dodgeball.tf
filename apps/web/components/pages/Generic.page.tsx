import { FC, useEffect, useState } from "react";
import { IS_PROD } from "../../utils/constants";
import { Box } from "@mui/material";
import type { Posts } from "@dodgeball/mongodb";
import { Colors } from "@dodgeball/core";
import Divider from "@mui/material/Divider";
import Pagination from "@mui/material/Pagination";

interface Props {
  category?: "news" | "updates";
}

const Generic: FC<Props> = ({ category }) => {
  const [rawMarkdowns, setRawMarkdowns] = useState<Posts[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const url = IS_PROD
    ? "https://api.dodgeball.tf/posts"
    : "http://localhost:3001/posts";

  const fetchPosts = async () => {
    let formattedUrl = `${url}?page=${page}`;
    if (category) {
      formattedUrl = `${url}?category=${category}&page=${page}`;
    }
    const response = await fetch(formattedUrl);
    const data = await response.json();
    setTotalPages(data.totalPages);
    setRawMarkdowns(data.posts);
  };

  useEffect(() => {
    fetchPosts();
  }, [page, category]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "1rem"
      }}
    >
      {rawMarkdowns.map((rawMarkdown, i) => (
        <Box
          key={i}
          sx={{
            // Every h1 element should have a color
            "& h1": {
              color: Colors.ORANGE
            }
          }}
        >
          {/* We also want a hr line between posts */}
          {i !== 0 && <Divider color={Colors.DARK_ORANGE} />}
          <div
            dangerouslySetInnerHTML={{
              __html: rawMarkdown.rawMarkdown
            }}
          ></div>
          {/* Lets have date */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1rem"
            }}
          >
            <Box
              sx={{
                color: Colors.ORANGE,
                fontSize: "0.8rem"
              }}
            >
              {new Date(rawMarkdown.createdAt).toLocaleDateString()}
            </Box>
          </Box>
        </Box>
      ))}
      {/* Lets have pagination at the bottom
          We know max is 10 posts per page
          So we can just do a simple math to get the max pages 
      */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "1rem"
        }}
      >
        <Pagination
          count={totalPages}
          onChange={(event, page) => {
            // @ts-ignore
            setPage(page - 1);
          }}
        />
      </Box>
    </Box>
  );
};

export default Generic;
