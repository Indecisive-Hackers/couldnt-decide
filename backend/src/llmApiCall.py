from google import genai

def prompt(query: str) -> str:
    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=query,
    )
    return response.text