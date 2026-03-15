from google import genai
import os
from dotenv import load_dotenv

def prompt(query: str) -> str:
    load_dotenv()
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    try:
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=query,
        )
    except genai.errors.ClientError as e:
        return e.message
    return response.text