from __future__ import annotations

import webbrowser
from urllib.parse import quote_plus


class YouTubeController:

    # =====================
    # OPEN YOUTUBE
    # =====================

    def open_youtube(self) -> str:

        webbrowser.open(
            "https://www.youtube.com"
        )

        return "Opening YouTube."

    # =====================
    # SEARCH YOUTUBE
    # =====================

    def search(
        self,
        query: str,
    ) -> str:

        url = (
            "https://www.youtube.com/results"
            f"?search_query={quote_plus(query)}"
        )

        webbrowser.open(url)

        return (
            f"Searching YouTube for: "
            f"{query}"
        )

    # =====================
    # PLAY VIDEO
    # =====================

    def play(
        self,
        query: str,
    ) -> str:

        url = (
            "https://www.youtube.com/results"
            f"?search_query={quote_plus(query)}"
        )

        webbrowser.open(url)

        return (
            f"Playing: {query}"
        )

    # =====================
    # OPEN CHANNEL
    # =====================

    def open_channel(
        self,
        channel_name: str,
    ) -> str:

        url = (
            "https://www.youtube.com/results"
            f"?search_query={quote_plus(channel_name)}"
        )

        webbrowser.open(url)

        return (
            f"Opening channel search: "
            f"{channel_name}"
        )


youtube = YouTubeController()
