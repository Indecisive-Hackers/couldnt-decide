from deepgram import Deepgram
import json

DEPPGRAM_API_KEY = ""

async def stt(audio):
    deepgram = Deepgram(DEPPGRAM_API_KEY)
    source = {'buffer': audio, 'mimetype' : 'audio/webm'}
    response = await deepgram.transcription.prerecorded(source, {'punctuate': True})
    json_response = json.dumps(response, indent=4)
    print(json_response)
    return json_response