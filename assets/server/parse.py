import json
import os
import requests
import string
import urllib.parse

def sanitize_filename(filename):
    valid_chars = "-_.() %s%s" % (string.ascii_letters, string.digits)
    sanitized_filename = ''.join(c for c in filename if c in valid_chars)
    return sanitized_filename

def download_image(url, directory):
    filename = url.split("/")[-1]  # Extract filename from the URL
    sanitized_filename = sanitize_filename(filename)
    filepath = os.path.join(directory, sanitized_filename)
    response = requests.get(url, stream=True)
    response.raise_for_status()
    with open(filepath, "wb") as file:
        for chunk in response.iter_content(chunk_size=8192):
            file.write(chunk)
    return filepath

def process_jsonl_file(file_path, output_directory):
    with open(file_path, "r") as file:
        for line in file:
            data = json.loads(line)
            media = data.get("media")
            if media and len(media) > 0:
                fullurl = media[0].get("fullUrl")
                if fullurl:
                    relative_path = download_image(fullurl, output_directory)
                    data["media"][0]["fullUrl"] = os.path.relpath(relative_path, output_directory)
            print(json.dumps(data))  # Output the modified JSON object

# Example usage:
jsonl_file = "downloaded.jsonl"
output_dir = "images/downloaded"

process_jsonl_file(jsonl_file, output_dir)
