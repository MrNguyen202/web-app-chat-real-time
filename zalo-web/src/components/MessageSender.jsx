import FavoriteIcon from "@mui/icons-material/Favorite";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';
import { Box, Button, Popover, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { convertToTime } from "../../utils/formatTime";
import RenderImageMessage from "./RenderImageMessage";
import { useSelector } from "react-redux";
import AudioPlayer from "./AudioPlayer";
import parseMessageContent from "./parseMessageContent";
import { IconFile } from "./StyledIcon";
import AttachReplytoMessage from "./AttachReplytoMessage";

const MessageSender = ({ message, handleLikeMessage, handleUnlikeMessage, handleRevokeMessage, handleDeleteMessage, setReplyToMessage }) => {
  const { content, createdAt } = message;
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useSelector((state) => state.user);
  const buttonRef = useRef(null);

  const handleOpenMoreOptions = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMoreOptions = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (!isHovered) {
      setAnchorEl(null);
    }
  }, [isHovered]);

  const open = Boolean(anchorEl);
  const id = open ? "more-options-popover" : undefined;

  const imageContainerWidth = 600;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: "30px",
        position: "relative",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!message?.revoked && isHovered && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button ref={buttonRef} onClick={() => setReplyToMessage(message)}>
            <FormatQuoteIcon fontSize="medium" />
          </Button>
          <Button ref={buttonRef} onClick={handleOpenMoreOptions}>
            <MoreHorizIcon fontSize="medium" />
          </Button>
          <Button>
            <ShortcutIcon fontSize="medium" />
          </Button>
        </Box>
      )}
      <Box
        sx={{
          padding: "15px",
          backgroundColor: "#8FE3FF",
          borderRadius: 3,
          display: "inline-block",
          maxWidth: "70%",
          minWidth: "7%",
        }}
      >
        {message?.revoked ? (
          <Typography color={"gray"} fontStyle={"italic"} textAlign="center">
            Tin nhắn đã được thu hồi
          </Typography>
        ) : (
          <>
            {message?.attachments?.length > 0 ? (
              !message?.content ? (
                <RenderImageMessage images={message?.attachments} wh={imageContainerWidth} />
              ) : (
                <Box sx={{ maxWidth: imageContainerWidth, maxHeight: imageContainerWidth, overflow: "hidden" }}>
                  <RenderImageMessage images={message?.attachments} wh={imageContainerWidth} />
                  <Box sx={{ marginBottom: "10px" }}>{parseMessageContent(content)}</Box>
                </Box>
              )
            ) : (
              message?.replyTo ? (
                <Box sx={{ maxWidth: imageContainerWidth, maxHeight: imageContainerWidth, overflow: "hidden" }}>
                  <AttachReplytoMessage message={message?.replyTo} key={message?.replyTo?._id} />
                  <Typography color={"black"} fontWeight={"bold"} marginBottom="10px">
                    {parseMessageContent(content)}
                  </Typography>
                </Box>
              ) : (
                <Typography color={"black"} fontWeight={"bold"} marginBottom="10px">
                  {parseMessageContent(content)}
                </Typography>
              )
            )}
            {message?.media && (
              <Box
                sx={{
                  marginBottom: "10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <video width="600" height="400" controls>
                  <source src={message?.media?.fileUrl} type="video/mp4" />
                </video>
                <Button href={message?.media?.fileUrl} download style={{ marginTop: "10px" }}>
                  <FileDownloadIcon fontSize="small" />
                  <Typography fontSize={14}>TẢI XUỐNG</Typography>
                </Button>
              </Box>
            )}
            {message?.files && (
              message?.files?.fileType === "audio/m4a" ? (
                <AudioPlayer uri={message?.files?.fileUrl} key={message?._id} />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <IconFile type={message?.files?.fileType} />
                  <Box marginLeft="10px">
                    <Typography fontSize={14} fontWeight="bold">
                      {message?.files?.fileName}
                    </Typography>
                    <Button href={message?.files?.fileUrl} download style={{ marginTop: "5px" }}>
                      <FileDownloadIcon fontSize="small" />
                      <Typography fontSize={14}>Tải xuống</Typography>
                    </Button>
                  </Box>
                </Box>
              )
            )}
            <Typography fontSize={14}>{convertToTime(createdAt)}</Typography>
          </>
        )}
      </Box>
      {!message?.revoked && (
        <>
          <Button
            sx={{ position: "absolute", bottom: "0px", right: "0px" }}
            onClick={(event) => {
              event.stopPropagation();
              handleLikeMessage(message._id, user?.id);
            }}
          >
            <Box
              sx={{
                position: "absolute",
                bottom: "-15px",
                right: "10px",
                backgroundColor: "#fff",
                padding: "5px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 99,
                boxShadow: "0 0 5px 0px #000",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            >
              <FavoriteIcon
                fontSize="small"
                color={message?.like?.some((us) => us?.userId === user?.id) ? "error" : "disabled"}
              />
            </Box>
          </Button>
          {message?.like?.length > 0 && (
            <Button
              sx={{ position: "absolute", bottom: "0px", right: "0px" }}
              onClick={(event) => {
                event.stopPropagation();
                handleUnlikeMessage(message._id, user?.id);
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  bottom: "-15px",
                  right: "50px",
                  backgroundColor: "#fff",
                  padding: "4px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 99,
                  boxShadow: "0 0 5px 0px #000",
                  borderRadius: "10px",
                }}
              >
                <FavoriteIcon fontSize="small" color="error" />
                <Typography fontSize={14} color="gray" marginRight="5px">
                  {message?.like?.reduce((sum, i) => sum + i.totalLike, 0)}
                </Typography>
              </Box>
            </Button>
          )}
        </>
      )}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseMoreOptions}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        sx={{
          "& .MuiPopover-paper": {
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            width: "300px",
            padding: "5px 0",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Button
            sx={{ justifyContent: "flex-start", padding: "8px 16px" }}
            onClick={(event) => {
              event.stopPropagation();
              handleRevokeMessage(message._id, user?.id);
              handleCloseMoreOptions();
            }}
          >
            <CommentsDisabledIcon fontSize="small" sx={{ marginRight: "8px", color: "red" }} />
            <Typography fontSize={14} color={"red"}>Thu hồi</Typography>
          </Button>
          <Button
            sx={{ justifyContent: "flex-start", padding: "8px 16px" }}
            onClick={(event) => {
              event.stopPropagation();
              handleDeleteMessage(message?._id);
              handleCloseMoreOptions();
            }}
          >
            <DeleteIcon fontSize="small" sx={{ marginRight: "8px", color: "red" }} />
            <Typography fontSize={14} color={"red"}>Xóa tin nhắn ở phía tôi</Typography>
          </Button>
        </Box>
      </Popover>
    </Box>
  );
};

MessageSender.propTypes = {
  message: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    conversationId: PropTypes.string.isRequired,
    senderId: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string,
      avatar: PropTypes.string,
    }).isRequired,
    members: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        avatar: PropTypes.string,
        name: PropTypes.string,
      })
    ),
    content: PropTypes.string,
    attachments: PropTypes.arrayOf(PropTypes.any),
    media: PropTypes.arrayOf(
      PropTypes.shape({
        fileName: PropTypes.string,
        fileType: PropTypes.string,
        fileUrl: PropTypes.string,
      })
    ),
    files: PropTypes.arrayOf(
      PropTypes.shape({
        fileName: PropTypes.string,
        fileType: PropTypes.string,
        fileUrl: PropTypes.string,
        _id: PropTypes.string,
      })
    ),
    replyTo: PropTypes.oneOfType([PropTypes.object, PropTypes.oneOf([null])]),
    revoked: PropTypes.bool,
    seen: PropTypes.arrayOf(PropTypes.string),
    reactions: PropTypes.arrayOf(PropTypes.any),
    like: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string,
        totalLike: PropTypes.number,
      })
    ),
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string,
    __v: PropTypes.number,
  }).isRequired,
  handleLikeMessage: PropTypes.func.isRequired,
  handleUnlikeMessage: PropTypes.func.isRequired,
  handleRevokeMessage: PropTypes.func.isRequired,
  handleDeleteMessage: PropTypes.func.isRequired,
  setReplyToMessage: PropTypes.func.isRequired,
};

export default MessageSender;