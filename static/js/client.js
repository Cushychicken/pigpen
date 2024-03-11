let gpioInputList = {};
let gpioOutputList = {};
let gpioLabelList = {};


// Websockted events
var socket = io.connect('http://' + document.domain + ':' + location.port);

socket.on('connect', function() {
  console.log('Connected to WebSocket');

  /*
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
    socket.emit('evt_clt_io', gpioObject);
    socket.emit('evt_clt_io', i2cObject);
    socket.emit('evt_clt_io', spiObject);
	*/
});

socket.on('evt_srv_io', function(data) {
  // Handle the data received from the server
  console.log('evt_srv_io:', data);
  gpioInputList = data['gpioInput'];
  gpioLabelList = data['gpioLabel'];
  gpioOutputList = data['gpioOutput'];

  // Add code here to update the UI with the new data
  updateInputTable(gpioInputList, gpioLabelList);
  updateOutputTable(gpioOutputList, gpioLabelList);
});

function updateInputTable(gpioInputList, gpioLabelList) {
  const tableBody = document.querySelector('#gpioInputTable tbody');
  tableBody.innerHTML = ''; // Clear existing table contents

  Object.keys(gpioInputList).forEach((gpio) => {
    const row = tableBody.insertRow();
    const cellGpio = row.insertCell(0);
    const cellFunction = row.insertCell(1);
    const cellValue = row.insertCell(2);

    cellGpio.textContent = gpio;

    if (gpio in gpioLabelList) {
      cellFunction.textContent = gpioLabelList[gpio];
    } else {
      cellFunction.textContent = gpio;
    }
    cellValue.textContent = gpioInputList[gpio];
  });
}

function updateOutputTable(gpioOutputList, gpioLabelList) {
  const tableBody = document.querySelector('#gpioOutputTable tbody');
  tableBody.innerHTML = ''; // Clear existing table contents

  Object.keys(gpioOutputList).forEach((gpio) => {
    const row = tableBody.insertRow();
    const cellGpio = row.insertCell(0);
    const cellFunction = row.insertCell(1);
    const cellValue = row.insertCell(2);

    cellGpio.textContent = gpio;

    if (gpio in gpioLabelList) {
      cellFunction.textContent = gpioLabelList[gpio];
    } else {
      cellFunction.textContent = gpio;
    }

    // Create and append buttons to cellValue
    const btnHi = document.createElement('a');
    btnHi.classList.add('btn', 'btn-primary', 'btn-sm');
    btnHi.textContent = 'Hi';
    cellValue.appendChild(btnHi);

    const btnLo = document.createElement('a');
    btnLo.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btnLo.textContent = 'Lo';
    cellValue.appendChild(btnLo);

    const btnToggle = document.createElement('a');
    btnToggle.classList.add('btn', 'btn-primary', 'btn-sm');
    btnToggle.textContent = 'Toggle';
    cellValue.appendChild(btnToggle);
  });
}

document.addEventListener('DOMContentLoaded', (event) => {
  //updateInputTable(gpioInputList, gpioLabelList);

  document.querySelectorAll('.form-select').forEach(select => {
    select.addEventListener('change', function() {
      const gpio = this.getAttribute('data-gpio');
      const value = this.value;

      if (value !== '-') {
        gpioInputList[gpio] = value;
      } else {
        delete gpioInputList[gpio];
      }

      updateInputTable(); // Update the table
    });
  });

  document.querySelectorAll('.pinLabel').forEach(cell => {
    cell.addEventListener('click', function() {
      if (!this.hasAttribute('contentEditable')) {
        this.setAttribute('contentEditable', true);
        this.focus();
      }
    });

    cell.addEventListener('blur', function() {
      this.removeAttribute('contentEditable');
      // Here you can also handle the new value
      // For example, send it to the server or process it
      const gpio = this.getAttribute('data-gpio');
      gpioLabelList[gpio] = this.textContent;
      socket.emit(
        'cfg_clt_io', {
          'gpio': gpio,
          'label': this.textContent
        });
    });

  });

  document.querySelectorAll('.select-container').forEach(container => {
    const select = container.querySelector('.form-select');
    const label = container.querySelector('.select-label');

    label.addEventListener('click', function() {
      select.style.display = 'block';
      select.focus();
    });

    select.addEventListener('change', function() {
      label.textContent = select.options[select.selectedIndex].text;
      select.style.display = 'none';
    });

    select.addEventListener('blur', function() {
      select.style.display = 'none';
    });
  });

  document.querySelectorAll('.form-select').forEach(select => {
    select.addEventListener('change', function() {
      const gpio = this.getAttribute('data-gpio');
      const value = this.value;
      console.log(`GPIO: ${gpio}, Value: ${value}`);
      // Here you can handle the association with the GPIO pinA
      // Update the list if the value is not '-'
      if (value !== '-') {
        if (value === 'Input') {
          gpioInputList[gpio] = value;
        } else if (value === 'Output') {
          gpioOutputList[gpio] = value;
        }
      } else {
        // Remove the GPIO from the list if the value is '-'
        delete gpioInputList[gpio];
        delete gpioOutputList[gpio];
      }

      socket.emit(
        'cfg_clt_io', {
          'gpio': [gpio],
          'direction': this.value
        });

      console.log(gpioInputList); // for debugging purposes
      console.log(gpioOutputList); // for debugging purposes
    });
  });
});