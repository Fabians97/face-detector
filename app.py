from flask import Flask, request, jsonify, render_template
import cv2
import numpy as np
from keras.models import load_model
from keras.preprocessing.image import img_to_array
import base64
import os

app = Flask(__name__, template_folder='templates', static_folder='static')
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface2.xml')
model_path = os.path.join(os.path.dirname(__file__), 'modelFEC.h5')
model = load_model(model_path)
class_names = ['Enojado', 'disgust', 'Miedo', 'Feliz', 'Neutral', 'Triste', 'Sorpresa']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/webcam')
def webcam():
    return render_template('webcam.html')

@app.route('/detect_emotion', methods=['POST'])
def detect_emotion():
    data = request.get_json()
    image_data = data['image'].split(',')[1]
    image = np.frombuffer(base64.b64decode(image_data), dtype=np.uint8)
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    detected_emotion = "No se detectaron emociones"

    if len(faces) == 0:
        print("No se detectaron rostros.")
        return jsonify({'result': detected_emotion})

    for (x, y, w, h) in faces:
        rostro = gray[y:y+h, x:x+w]
        rostro = cv2.resize(rostro, (48, 48))
        face2 = img_to_array(rostro)
        face2 = np.expand_dims(face2, axis=0)
        
        preds = model.predict(face2)
        emotion = class_names[np.argmax(preds)]
        print(f"Predicción: {preds}")
        print(f"Emoción detectada: {emotion}")
        detected_emotion = emotion
    
    return jsonify({'result': detected_emotion})

if __name__ == '__main__':
    app.run(debug=True)
