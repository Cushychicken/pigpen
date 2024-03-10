# Native Libraries
import logging
from logging.handlers import RotatingFileHandler
import os

# Flask Imports and Plugins
from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO

# Internal Imports
import io_engine


# Flask Configurations
app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
socketio = SocketIO(app)


@app.route('/')
def index():
    return render_template('index.html')

if os.getenv('ENABLE_API') == 'True':
    @app.route('/api/data', methods=['GET'])
    def get_data():
        data = {'key': 'value'}
        return jsonify(data)

@app.route('/api/modify', methods=['POST'])
def modify_data():
    # Modify program state based on the request
    new_data = {'key': 'new_value'}

    # Emit the updated data to all connected clients
    socketio.emit('data_updated', new_data)
    return jsonify(new_data)


@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('update')
def handle_update_io(json_data):
    print("Received IO update:", json_data)
    io_engine.process_json(json_data)


if __name__ == '__main__':
    socketio.run(app, debug=True)

