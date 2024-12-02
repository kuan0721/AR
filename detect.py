import time
import cv2
import numpy as np
from flask import Flask, render_template, Response, jsonify
import mediapipe as mp

app = Flask(__name__)

# 初始化 MediaPipe 手勢模組
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(max_num_hands=1, min_detection_confidence=0.9, min_tracking_confidence=0.7)
mp_draw = mp.solutions.drawing_utils

# 攝影機串流 URL
url = 'http://192.168.225.53:4747/video'
cap = cv2.VideoCapture(url)
if not cap.isOpened():
    print("Error: Unable to open video source.")
    exit()

# 全局變數
pinch_count = 0
first_pinch_time = 0
last_valid_button = None
button_triggered = None
detection_paused = False
show_button_text = False
current_button = None

def calculate_distance(point1, point2):
    """計算兩點的歐幾里得距離"""
    return np.linalg.norm(np.array(point1) - np.array(point2))

def check_button_proximity(hand_landmarks):
    """檢查手是否在按鈕範圍內，返回 'left', 'right' 或 None"""
    x = hand_landmarks.landmark[9].x  # 手掌中心點的 x 座標
    if x < 0.4:  # 假設左按鈕範圍
        return 'left'
    elif x > 0.6:  # 假設右按鈕範圍
        return 'right'
    return None

def gen_frames():
    global pinch_count, first_pinch_time, last_valid_button
    global button_triggered, detection_paused, show_button_text, current_button

    while True:
        success, frame = cap.read()
        if not success:
            break

        # 翻轉影像
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(rgb_frame)

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                mp_draw.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

                # 計算拇指與無名指、小指之間的距離
                thumb_tip = hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_TIP]
                ring_finger_tip = hand_landmarks.landmark[mp_hands.HandLandmark.RING_FINGER_TIP]
                pinky_tip = hand_landmarks.landmark[mp_hands.HandLandmark.PINKY_TIP]

                # 計算拇指與無名指、小指的距離
                distance_thumb_ring = calculate_distance((thumb_tip.x, thumb_tip.y), (ring_finger_tip.x, ring_finger_tip.y))
                distance_thumb_pinky = calculate_distance((thumb_tip.x, thumb_tip.y), (pinky_tip.x, pinky_tip.y))

                # 檢查是否靠近按鈕
                current_button = check_button_proximity(hand_landmarks)

                # 設置捏合條件（兩個手指間的距離小於特定閾值）
                if distance_thumb_ring < 0.03 and distance_thumb_pinky < 0.03:  # 捏合條件
                    print(f"Pinch detected with distances: {distance_thumb_ring}, {distance_thumb_pinky}")
                    if pinch_count == 0 and current_button:
                        # 第一次捏合
                        pinch_count = 1
                        first_pinch_time = time.time()
                        last_valid_button = current_button
                        print(f"First pinch detected on button: {current_button}")
                    elif pinch_count == 1:
                        # 第二次捏合
                        time_diff = time.time() - first_pinch_time
                        if 0.3 <= time_diff <= 1.5 and current_button == last_valid_button:
                            # 雙擊成功
                            pinch_count = 2
                            button_triggered = last_valid_button
                            show_button_text = True
                            detection_paused = True
                            print(f"Double click confirmed on button: {button_triggered}")
                        elif time_diff > 1.5:
                            # 超時重置
                            pinch_count = 0
                            print("Double click timeout, resetting state.")
                else:
                    # 未捏合，重置計數
                    if pinch_count == 2:
                        pinch_count = 0
                        detection_paused = False
                        show_button_text = False
                        last_valid_button = None

        # 顯示結果
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def index():
    """主頁面"""
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    """影像串流"""
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/button_status')
def button_status():
    """返回按鈕觸發狀態"""
    global button_triggered, show_button_text

    if show_button_text:
        response = {'is_active': True, 'button_triggered': button_triggered}
        show_button_text = False  # 清除狀態
        return jsonify(response)
    return jsonify({'is_active': False})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
