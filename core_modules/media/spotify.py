from urllib.parse import quote_plus


class SpotifyClient:
    def search_url(self, query: str) -> str:
        return f"https://open.spotify.com/search/{quote_plus(query)}"
