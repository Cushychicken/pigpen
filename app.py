# Native Libraries
import logging
from logging.handlers import RotatingFileHandler
import os

# Flask Imports, Plugins, and configuration 
from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
socketio = SocketIO(app)

# Internal Imports
import io_engine


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
    
    # Mock data for testing
    data = {
            'gpioInput': {
                    'GPIO10': 'Input',
                    'GPIO21': 'Input',
                },
            'gpioOutput': {
                    'GPIO5': 'Output',
                    'GPIO19': 'Output',
                },
            'gpioLabel': {
                    'GPIO5': 'SW_EN',
                    #'GPIO10': 'ADC_INT_L',
                    'GPIO19': 'ADC_RST_L',
                    'GPIO21': 'SW_PG',
                },
            }

    # Sends initial config of data from device 
    socketio.emit('evt_srv_io', data)
    print(f'evt_srv_io: sent {data=}')

@socketio.on('evt_clt_io')
def handle_update_io(json_data):
    print("evt_clt_io: received client io event ", json_data)
    #io_engine.process_json(json_data)

@socketio.on('cfg_clt_io')
def handle_cfg_io(json_data):
    print("cfg_clt_io: received client io event ", json_data)
    #io_engine.process_json(json_data)


if __name__ == '__main__':
    socketio.run(app, debug=True)

