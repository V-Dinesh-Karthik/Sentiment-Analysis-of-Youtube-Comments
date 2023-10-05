from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
# from fastapi.encoders import jsonable_encoder
from models import LinkBody
from googleapiclient.discovery import build

router = APIRouter()

api_key = "AIzaSyDlGOT7DXeeGRSKZgfAcTzwa-pFhKpc30E"


@router.post("/scrap")
async def scrap_comments(link: LinkBody):
    comments = []
    reply_count = 0

    video_link = link.url
    video_link = video_link.split("v=")[1]

    ytd = build("youtube", "v3", developerKey=api_key)

    video_response = (
        ytd.commentThreads()
        .list(
            part="snippet,replies",
            videoId=video_link,
            textFormat="plainText",
        )
        .execute()
    )

    while video_response:
        for item in video_response["items"]:
            comment = item["snippet"]["topLevelComment"]
            comment = comment["snippet"]["textDisplay"]

            repliesList = []

            if "replies" in item:
                replies = item["replies"]["comments"]
                for reply in replies:
                    reply_text = reply["snippet"]["textDisplay"]
                    repliesList.append(reply_text)
                    reply_count += 1

            comments.append({comment: repliesList})

        if "nextPageToken" in video_response:
            video_response = (
                ytd.commentThreads()
                .list(
                    part="snippet,replies",
                    videoId=video_link,
                    textFormat="plainText",
                    pageToken=video_response["nextPageToken"],
                )
                .execute()
            )
        else:
            break

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "comments": comments,
            "no. of comments": len(comments)+reply_count,
        }
    )


@router.get("/analyze")
async def analyze():
    pass
