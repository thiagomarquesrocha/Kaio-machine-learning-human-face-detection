import socketio
import eventlet
import eventlet.wsgi
from flask import Flask, render_template

# Documentation Socket IO
# - https://github.com/miguelgrinberg/python-socketio
sio = socketio.Server()
app = Flask(__name__)

@app.route('/')
def index():
    return "Serve the client-side application."

@sio.on('connect', namespace='/detection')
def connect(sid, environ):
    print("connect ", sid)

@sio.on('gesture', namespace='/detection')
def message(sid, data):
    print("message ", data)
    sio.emit('gesture', data)

@sio.on('disconnect', namespace='/detection')
def disconnect(sid):
    print('disconnect ', sid)

if __name__ == '__main__':
    # wrap Flask application with engineio's middleware
    app = socketio.Middleware(sio, app)

    # deploy as an eventlet WSGI server
    eventlet.wsgi.server(eventlet.listen(('192.168.1.114', 8000)), app)