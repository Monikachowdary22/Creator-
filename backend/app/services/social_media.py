# ==========================================
# Sprint 4 - Mock Social Media Service
# ==========================================


MOCK_PLATFORM_DATA = {

    "YouTube": [
        {
            "platform": "YouTube",
            "content_title": "Python Tutorial",
            "views": 15000,
            "likes": 1200,
            "comments": 150,
            "shares": 100,
            "reach": 18000
        },
        {
            "platform": "YouTube",
            "content_title": "FastAPI Tutorial",
            "views": 12000,
            "likes": 950,
            "comments": 120,
            "shares": 80,
            "reach": 14500
        }
    ],

    "Instagram": [
        {
            "platform": "Instagram",
            "content_title": "Coding Tips",
            "views": 11000,
            "likes": 1800,
            "comments": 220,
            "shares": 150,
            "reach": 14000
        },
        {
            "platform": "Instagram",
            "content_title": "Developer Life",
            "views": 9000,
            "likes": 1500,
            "comments": 180,
            "shares": 120,
            "reach": 12000
        }
    ],

    "Facebook": [
        {
            "platform": "Facebook",
            "content_title": "Technology Updates",
            "views": 8500,
            "likes": 700,
            "comments": 90,
            "shares": 110,
            "reach": 10500
        },
        {
            "platform": "Facebook",
            "content_title": "Programming Basics",
            "views": 7500,
            "likes": 600,
            "comments": 75,
            "shares": 90,
            "reach": 9200
        }
    ],

    "LinkedIn": [
        {
            "platform": "LinkedIn",
            "content_title": "Career Tips",
            "views": 6000,
            "likes": 500,
            "comments": 80,
            "shares": 130,
            "reach": 8000
        },
        {
            "platform": "LinkedIn",
            "content_title": "Software Engineering",
            "views": 5500,
            "likes": 450,
            "comments": 65,
            "shares": 100,
            "reach": 7200
        }
    ],

    "TikTok": [
        {
            "platform": "TikTok",
            "content_title": "Coding Hack",
            "views": 20000,
            "likes": 3200,
            "comments": 300,
            "shares": 250,
            "reach": 25000
        },
        {
            "platform": "TikTok",
            "content_title": "Python Trick",
            "views": 18000,
            "likes": 2900,
            "comments": 260,
            "shares": 220,
            "reach": 22000
        }
    ],

    "X": [
        {
            "platform": "X",
            "content_title": "Tech News",
            "views": 5000,
            "likes": 400,
            "comments": 60,
            "shares": 100,
            "reach": 6500
        },
        {
            "platform": "X",
            "content_title": "AI Update",
            "views": 4500,
            "likes": 350,
            "comments": 50,
            "shares": 80,
            "reach": 5800
        }
    ]
}


def get_platform_data(platform: str):

    return MOCK_PLATFORM_DATA.get(
        platform,
        []
    )


def get_available_platforms():

    return list(
        MOCK_PLATFORM_DATA.keys()
    )


def calculate_platform_engagement(data):

    likes = data.get("likes", 0)
    comments = data.get("comments", 0)
    shares = data.get("shares", 0)
    reach = data.get("reach", 0)

    total_engagement = (
        likes
        + comments
        + shares
    )

    if reach == 0:
        engagement_rate = 0
    else:
        engagement_rate = (
            total_engagement / reach
        ) * 100

    return round(
        engagement_rate,
        2
    )