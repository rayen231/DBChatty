from deep_translator import GoogleTranslator

def translate_any_to_english(text):
    translator = GoogleTranslator(source='auto', target='en')
    translated = translator.translate(text)
    return translated


def translate_english_to_arabic(text):
    translator = GoogleTranslator(source='en', target='ar')
    translated = translator.translate(text)
    return translated


def translate_english_to_french(text):
    translator = GoogleTranslator(source='en', target='fr')
    translated = translator.translate(text)
    return translated


def translate_french_to_english(text):
    translator = GoogleTranslator(source='fr', target='en')
    translated = translator.translate(text)
    return translated