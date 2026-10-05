from urllib.parse import quote_plus


class WebSearchTool:
    def search_url(self, query: str) -> str:
        return f"https://duckduckgo.com/?q={quote_plus(query)}"
