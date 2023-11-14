from fastapi import APIRouter, status, Depends
from fastapi.responses import JSONResponse
from models import LinkBody, AnalyzeBody
from googleapiclient.discovery import build
from auth import Authorization
import os

os.environ["TRANSFORMERS_CACHE"] = "D:\\SentimentAnlysis\\Backend\\app\\cache"
from transformers import pipeline   # noqa

router = APIRouter()

auth_handler = Authorization()

api_key = "AIzaSyDlGOT7DXeeGRSKZgfAcTzwa-pFhKpc30E"

sentiment_analyzer = pipeline(task='text-classification',model="j-hartmann/sentiment-roberta-large-english-3-classes")

@router.post("/scrap")
async def scrap_comments(
        link: LinkBody, userId=Depends(auth_handler.auth_wrapper)
        ):
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

    jsonFormat = []

    for index, commentDict in enumerate(comments):
        comment = list(commentDict.keys())[0]
        comment_id = str(index + 1)

        sentiment = None

        conf_score = None

        is_reply = bool(commentDict[comment])

        comment_data = {
            "id": comment_id,
            "comment": comment,
            "sentiment": sentiment,
            "conf_score": conf_score,
            "isReply": is_reply,
        }

        jsonFormat.append(comment_data)

        if is_reply:
            for replyC in commentDict[comment]:
                comment_id += "_reply"
                comment_data = {
                    "id": comment_id,
                    "comment": replyC,
                    "sentiment": sentiment,
                    "conf_score": conf_score,
                    "isReply": True,
                }
                jsonFormat.append(comment_data)

    return JSONResponse(
        status_code=status.HTTP_200_OK, content={"data": jsonFormat}
        )


@router.post("/analyze")
async def analyze(data: AnalyzeBody,
                  userId=Depends(auth_handler.auth_wrapper)
                  ):
    _data = data.data

    for item in _data:
        comment = item["comment"]
        sentiment_result = sentiment_analyzer(comment)
        sentiment_label = sentiment_result[0]["label"]
        conf_score = sentiment_result[0]["score"]
        item["sentiment"] = sentiment_label
        item["conf_score"] = format(conf_score, ".5f")

    print(_data)

    return JSONResponse(
        status_code=status.HTTP_200_OK, content={"data": _data}
        )
