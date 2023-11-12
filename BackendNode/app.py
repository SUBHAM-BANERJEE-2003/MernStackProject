from flask import Flask, request, jsonify
from bs4 import BeautifulSoup
from flask_cors import CORS

import requests

app = Flask(__name__)
CORS(app)

@app.route("/")
def homePage():
    url = request.args.get('url', '')
    search_word = request.args.get('word', '')

    if not url or not search_word:
        return jsonify({"error": "Invalid parameters. Please provide both 'url' and 'word'."})

    # Send a GET request to the URL
    response = requests.get(url)

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        occurrences = soup.get_text().lower().count(search_word.lower())

        result = {
            "word": search_word,
            "occurrences": occurrences
        }

        return jsonify(result)
    else:
        return jsonify({"error": f"Failed to retrieve the page. Status code: {response.status_code}"})

if __name__ == "__main__":
    app.run(debug=True)
