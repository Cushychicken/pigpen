var socket = io.connect('http://' + document.domain + ':' + location.port);

socket.on('connect', function() {
    console.log('Connected to WebSocket');
});

socket.on('update_data', function(data) {
    // Update the tables with the new data received from the server
    console.log('Data updated:', data);
    // Add code here to update the tables with the new data
});

