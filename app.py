import os
from flask import Flask, render_template, request, session, jsonify
from openai import OpenAI

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "change_this!")  # for session

# initialize OpenAI client with your ChatGPT Plus key
openai = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

SYSTEM_PROMPT = {
    "role": "system",
    "content": (
        "You’re an empathetic companion. "
        "Respond with warmth and understanding to any feelings the user shares."
    )
}


def get_history():
    # initialize a fresh conversation if needed
    if "history" not in session:
        session["history"] = [SYSTEM_PROMPT]
    return session["history"]


@app.route("/")
def index():
    return render_template("chat.html")


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_msg = {"role": "user", "content": data["message"]}
    history = get_history()
    history.append(user_msg)

    # call ChatGPT
    resp = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=history
    )
    assistant_msg = resp.choices[0].message
    # append assistant’s reply to history
    history.append(assistant_msg)
    session["history"] = history

    return jsonify({"reply": assistant_msg["content"]})


if __name__ == "__main__":
    app.run(debug=True)
