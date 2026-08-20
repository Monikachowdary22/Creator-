import os
import requests

from dotenv import load_dotenv


load_dotenv()


YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3"


def fetch_youtube_videos(channel_id: str, max_results: int = 10):
    """
    Fetch videos from a YouTube channel and transform them
    into the common CreatorIQ data format.
    """

    if not YOUTUBE_API_KEY:
        raise ValueError(
            "YOUTUBE_API_KEY is not configured in the .env file"
        )

    if not channel_id:
        raise ValueError("YouTube channel ID is required")

    # --------------------------------------------------
    # Step 1: Get video IDs from the channel
    # --------------------------------------------------

    search_params = {
        "part": "snippet",
        "channelId": channel_id,
        "type": "video",
        "maxResults": min(max_results, 50),
        "order": "date",
        "key": YOUTUBE_API_KEY
    }

    try:
        search_response = requests.get(
            f"{YOUTUBE_API_URL}/search",
            params=search_params,
            timeout=15
        )
    except requests.RequestException as error:
        raise RuntimeError(
            f"Unable to connect to YouTube API: {error}"
        )

    if search_response.status_code != 200:
        handle_youtube_error(search_response)

    search_data = search_response.json()

    search_items = search_data.get("items", [])

    if not search_items:
        return []

    video_ids = [
        item.get("id", {}).get("videoId")
        for item in search_items
        if item.get("id", {}).get("videoId")
    ]

    if not video_ids:
        return []

    # --------------------------------------------------
    # Step 2: Get video statistics and details
    # --------------------------------------------------

    video_params = {
        "part": "snippet,statistics",
        "id": ",".join(video_ids),
        "key": YOUTUBE_API_KEY
    }

    try:
        video_response = requests.get(
            f"{YOUTUBE_API_URL}/videos",
            params=video_params,
            timeout=15
        )
    except requests.RequestException as error:
        raise RuntimeError(
            f"Unable to fetch YouTube video data: {error}"
        )

    if video_response.status_code != 200:
        handle_youtube_error(video_response)

    video_data = video_response.json()

    videos = video_data.get("items", [])

    # --------------------------------------------------
    # Step 3: Transform into CreatorIQ common format
    # --------------------------------------------------

    results = []

    for video in videos:

        snippet = video.get("snippet", {})
        statistics = video.get("statistics", {})

        views = int(statistics.get("viewCount", 0))
        likes = int(statistics.get("likeCount", 0))
        comments = int(statistics.get("commentCount", 0))

        # YouTube Data API does not provide shares/reach
        # in the public video statistics response.
        shares = 0
        reach = 0

        results.append({
            "platform": "YouTube",
            "external_content_id": video.get("id"),
            "content_title": snippet.get(
                "title",
                "Untitled YouTube Video"
            ),
            "views": views,
            "likes": likes,
            "comments": comments,
            "shares": shares,
            "reach": reach,
            "published_date": (
                snippet.get("publishedAt", "")[:10]
            )
        })

    return results


def handle_youtube_error(response):
    """
    Convert common YouTube API errors into
    meaningful application errors.
    """

    try:
        error_data = response.json()

        errors = error_data.get(
            "error",
            {}
        ).get(
            "errors",
            []
        )

        reason = (
            errors[0].get("reason")
            if errors
            else None
        )

        if reason == "keyInvalid":
            raise ValueError(
                "YouTube API key is invalid."
            )

        if reason == "quotaExceeded":
            raise RuntimeError(
                "YouTube API quota has been exceeded."
            )

        if reason == "rateLimitExceeded":
            raise RuntimeError(
                "YouTube API rate limit exceeded."
            )

        if reason == "channelNotFound":
            raise ValueError(
                "YouTube channel was not found."
            )

    except ValueError:
        raise

    except Exception:
        pass

    raise RuntimeError(
        f"YouTube API request failed "
        f"with status code {response.status_code}."
    )