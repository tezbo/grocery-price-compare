from flask import Flask, jsonify, request
import subprocess
import os
import json

app = Flask(__name__)

@app.route('/scrape_recipe', methods=['POST'])
def scrape():
    data = request.get_json()
    url = data.get('url')

    # Run the scrape_recipe.py script
    subprocess.run(['python', 'backend/scrapers/scrape_recipe.py', url])

    # Read the generated recipe_data.json file
    with open('backend/scrapers/recipe_data.json', 'r') as f:
        recipe_data = json.load(f)

    return jsonify(recipe_data)

if __name__ == '__main__':
    app.run(debug=True)