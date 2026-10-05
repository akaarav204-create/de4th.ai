import webbrowser
from urllib.parse import quote_plus


class YouTubeClient:
    def search_url(self, query: str) -> str:
        return f"https://www.youtube.com/results?search_query={quote_plus(query)}"

    def open_search(self, query: str) -> None:
        webbrowser.open(self.search_url(query))
