import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React from "react";

const BookTile = ({
  bookId,
  imageUrl,
  title,
  author,
  chapters = [],
  // isNew = false,
  className = "",
}) => {
  const router = useRouter();
  const handleBookClick = () => {
    if (!bookId) return;
    router.push(`/book?number=${encodeURIComponent(bookId)}`);
  };
  const handleChapterClick = (event, chapter) => {
    event.stopPropagation();
    router.push(`/chapter?name=${chapter.id}`);
    return;
  };
  return (
    <Card sx={{ backgroundColor: "transparent" }} className={`${className}`}>
      <CardActionArea onClick={handleBookClick}>
        <CardMedia
          className="justify-items-center"
          sx={{
            height: 250,
            width: 200,
            objectFit: "fill",
            backgroundSize: "100% 100%", // Forces background to stretch
            "&.MuiCardMedia-root": {
              objectFit: "fill",
            },
          }}
          image={imageUrl}
          title={`${title} cover`}
        />
        <CardContent sx={{ backgroundColor: "transparent" }}>
          <Typography
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            gutterBottom
            variant="h5"
            component="div"
          >
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {author}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ height: 170 }} className="flex flex-col">
        {chapters &&
          chapters
            .slice(-2)
            .reverse()
            .map((chapter, index) => (
              <React.Fragment key={index}>
                <Button
                  sx={{ textTransform: "none" }}
                  className="w-full"
                  onClick={(event) => handleChapterClick(event, chapter)}
                >
                  <span className="w-full px-2.5 py-1 mt-2 text-sm text-black rounded-md bg-zinc-300">
                    Chapter {chapter.chapter}
                  </span>
                </Button>
                <time
                  dateTime={chapter.createdAt}
                  className="self-end mt-2 text-sm text-stone-600"
                >
                  {moment(chapter.createdAt).format("YYYY-MM-DD hh:mm")}
                </time>
              </React.Fragment>
            ))}
      </CardActions>
    </Card>
  );
};

BookTile.propTypes = {
  bookId: PropTypes.number,
  imageUrl: PropTypes.string,
  title: PropTypes.string,
  author: PropTypes.string,
  chapters: PropTypes.array,
  isNew: PropTypes.bool,
  className: PropTypes.string,
};
export default BookTile;
