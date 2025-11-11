# # app.py
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import google.generativeai as genai
# import os
# from dotenv import load_dotenv

# # Load environment variables from the .env file
# load_dotenv()

# app = Flask(__name__)
# CORS(app)

# # =============================
# # 1. Configure Gemini AI
# # =============================
# try:
#     # Retrieve the API key from environment variables
#     API_KEY = os.environ.get("GOOGLE_API_KEY")
#     if not API_KEY:
#         raise ValueError("GOOGLE_API_KEY is not set in environment variables.")

#     genai.configure(api_key=API_KEY)
#     model = genai.GenerativeModel("gemini-1.5-flash")

# except Exception as e:
#     print(f"Error configuring Gemini API: {e}")
#     # You might want to exit or handle this more gracefully in a real app
#     # For now, we'll let it crash, which is fine for development
#     exit()

# # Dictionary to hold chat histories for different sessions
# chat_sessions = {}

# @app.route('/chat', methods=['POST'])
# def chat():
#     data = request.json
#     user_input = data.get('message')
#     chat_id = data.get('chatId')

#     if not user_input or not chat_id:
#         return jsonify({"error": "Missing 'message' or 'chatId'"}), 400

#     if chat_id not in chat_sessions:
#         # Create a new chat session for this ID
#         try:
#             chat_sessions[chat_id] = model.start_chat(history=[])
#         except Exception as e:
#             return jsonify({"error": f"Failed to start new chat session: {e}"}), 500

#     current_chat = chat_sessions[chat_id]

#     try:
#         response = current_chat.send_message(user_input)
#         return jsonify({"reply": response.text})
#     except Exception as e:
#         print(f"An error occurred: {e}")
#         return jsonify({"error": "An internal error occurred. Please try again."}), 500

# if __name__ == '__main__':
#     # Flask will run on localhost:5000
#     app.run(host='127.0.0.1', port=5000, debug=True)



from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

app = Flask(__name__)
# ✅ Correct CORS configuration to allow POST requests from localhost:3000 to the /chat endpoint
CORS(app, resources={r"/chat": {"origins": "http://localhost:3000"}})

# =============================
# 1. Configure Gemini AI
# =============================
try:
    # Retrieve the API key from environment variables
    API_KEY = os.environ.get("GOOGLE_API_KEY")
    if not API_KEY:
        raise ValueError("GOOGLE_API_KEY is not set in environment variables.")

    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel("gemini-2.5-flash")

except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    exit()

# Dictionary to hold chat histories for different sessions
chat_sessions = {}

# ✅ The route handler only needs to specify POST. CORS handles OPTIONS.
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('message')
    chat_id = data.get('chatId')
    user_profile = data.get('userProfile')

    if not user_input or not chat_id:
        return jsonify({"error": "Missing 'message' or 'chatId'"}), 400

    if chat_id not in chat_sessions:
        try:
            chat_sessions[chat_id] = model.start_chat(history=[])
        except Exception as e:
            return jsonify({"error": f"Failed to start new chat session: {e}"}), 500

    current_chat = chat_sessions[chat_id]

    try:
        response = current_chat.send_message(user_input)
        return jsonify({"reply": response.text})
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "An internal error occurred. Please try again."}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, debug=True)
