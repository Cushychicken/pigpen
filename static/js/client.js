var socket = io.connect('http://' + document.domain + ':' + location.port);

socket.on('connect', function() {
    console.log('Connected to WebSocket');
    
    // Example objects with the updated schema
    var gpioObject = {
        "type": "GPIO",
        "pin": 17,
        "mode": "output",
        "state": "high"
    };

    var i2cObject = {
        "type": "I2C",
        "address": 0x48,
        "mode": "write",
        "data": 0xFF
    };

    var spiObject = {
        "type": "SPI",
        "bus": 0,
        "device": 0,
        "mode": "write",
        "data": [0x01, 0x02, 0x03]
    };

    // Send the objects to the server
    socket.emit('update', gpioObject);
    socket.emit('update', i2cObject);
    socket.emit('update', spiObject);
});

socket.on('update_data', function(data) {
    // Handle the data received from the server
    console.log('Data updated:', data);
    // Add code here to update the UI with the new data
});
