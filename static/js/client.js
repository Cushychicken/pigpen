js-beautify
(v1.15.1)
Beautify JavaScript, JSON, React.js, HTML, CSS, SCSS, and SASS

Enable Dark Mode

Beautify JavaScript
Beautify Code (cmd-enter)

Copy to Clipboard
 
Select All
 
Clear
 No file chosen
Options

Indent with 2 spaces

Allow 5 newlines between tokens

Do not wrap lines

Braces with control statement
HTML <style>, <script> formatting:


Add one indent level
  End script and style with newline?
Support e4x/jsx syntax
Use comma-first list style?
Detect packers and obfuscators? (unsafe)
Preserve inline braces/code blocks?
Keep array indentation?
Break lines on chained methods?
Space before conditional: "if(x)" / "if (x)"
Unescape printable chars encoded as \xNN or \uNNNN?
Use JSLint-happy formatting tweaks?
Indent <head> and <body> sections?
Keep indentation on empty lines?
Use a simple textarea for code input?
Additional Settings (JSON):

{}
Your Selected Options (JSON):

{
  "indent_size": "2",
  "indent_char": " ",
  "max_preserve_newlines": "5",
  "preserve_newlines": true,
  "keep_array_indentation": false,
  "break_chained_methods": false,
  "indent_scripts": "normal",
  "brace_style": "collapse",
  "space_before_conditional": true,
  "unescape_strings": false,
  "jslint_happy": false,
  "end_with_newline": false,
  "wrap_line_length": "0",
  "indent_inner_html": false,
  "comma_first": false,
  "e4x": false,
  "indent_empty_lines": false
}
Created by Einar Lielmanis, maintained and evolved by Liam Newman.

All of the source code is completely free and open, available on GitHub under MIT licence, and we have a command-line version, python library and a node package as well.

We use the wonderful CodeMirror syntax highlighting editor, written by Marijn Haverbeke.

Made with a great help of many contributors. Special thanks to:
Jason Diamond, Patrick Hof, Nochum Sossonko, Andreas Schneider, Dave Vasilevsky, Vital Batmanov, Ron Baldwin, Gabriel Harrison, Chris J. Shull, Mathias Bynens, Vittorio Gambaletta, Stefano Sanfilippo and Daniel Stockman.

1
let gpioInputList = {};
2
let gpioOutputList = {};
3
let gpioLabelList = {};
4
​
5
​
6
// Websockted events
7
var socket = io.connect('http://' + document.domain + ':' + location.port);
8
​
9
socket.on('connect', function() {
10
  console.log('Connected to WebSocket');
11
​
12
  /*
13
    // Example objects with the updated schema
14
    var gpioObject = {
15
        "type": "GPIO",
16
        "pin": 17,
17
        "mode": "output",
18
        "state": "high"
19
    };
20
​
21
    var i2cObject = {
22
        "type": "I2C",
23
        "address": 0x48,
24
        "mode": "write",
25
        "data": 0xFF
26
    };
27
​
28
    var spiObject = {
29
        "type": "SPI",
30
        "bus": 0,
31
        "device": 0,
32
        "mode": "write",
33
        "data": [0x01, 0x02, 0x03]
34
    };
35
​
36
    // Send the objects to the server
37
    socket.emit('evt_clt_io', gpioObject);
38
    socket.emit('evt_clt_io', i2cObject);
39
    socket.emit('evt_clt_io', spiObject);
40
    */
41
});
42
​
43
socket.on('evt_srv_io', function(data) {
44
  // Handle the data received from the server
45
  console.log('evt_srv_io:', data);
46
  gpioInputList = data['gpioInput'];
47
  gpioLabelList = data['gpioLabel'];
48
  gpioOutputList = data['gpioOutput'];
49
​
50
  // Add code here to update the UI with the new data
51
  updateInputTable(gpioInputList, gpioLabelList);
52
  updateOutputTable(gpioOutputList, gpioLabelList);
53
});
54
​
55
function updateInputTable(gpioInputList, gpioLabelList) {
56
  const tableBody = document.querySelector('#gpioInputTable tbody');
57
  tableBody.innerHTML = ''; // Clear existing table contents
58
​
59
  Object.keys(gpioInputList).forEach((gpio) => {
60
    const row = tableBody.insertRow();
61
    const cellGpio = row.insertCell(0);
62
    const cellFunction = row.insertCell(1);
63
    const cellValue = row.insertCell(2);
64
​
65
    cellGpio.textContent = gpio;
66
​
67
    if (gpio in gpioLabelList) {
68
      cellFunction.textContent = gpioLabelList[gpio];
69
    } else {
70
      cellFunction.textContent = gpio;
71
    }
72
    cellValue.textContent = gpioInputList[gpio];
73
  });
74
}
75
​
76
function updateOutputTable(gpioOutputList, gpioLabelList) {
77
  const tableBody = document.querySelector('#gpioOutputTable tbody');
78
  tableBody.innerHTML = ''; // Clear existing table contents
79
​
80
  Object.keys(gpioOutputList).forEach((gpio) => {
81
    const row = tableBody.insertRow();
82
    const cellGpio = row.insertCell(0);
83
    const cellFunction = row.insertCell(1);
84
    const cellValue = row.insertCell(2);
85
​
86
    cellGpio.textContent = gpio;
87
​
88
    if (gpio in gpioLabelList) {
89
      cellFunction.textContent = gpioLabelList[gpio];
90
    } else {
91
      cellFunction.textContent = gpio;
92
    }
93
​
94
    // Create and append buttons to cellValue
95
    const btnHi = document.createElement('a');
96
    btnHi.classList.add('btn', 'btn-primary', 'btn-sm');
97
    btnHi.textContent = 'Hi';
98
    cellValue.appendChild(btnHi);
99
​
100
    const btnLo = document.createElement('a');
101
    btnLo.classList.add('btn', 'btn-outline-primary', 'btn-sm');
102
    btnLo.textContent = 'Lo';
103
    cellValue.appendChild(btnLo);
104
​
105
    const btnToggle = document.createElement('a');
106
    btnToggle.classList.add('btn', 'btn-primary', 'btn-sm');
107
    btnToggle.textContent = 'Toggle';
108
    cellValue.appendChild(btnToggle);
109
  });
110
}
111
​
112
document.addEventListener('DOMContentLoaded', (event) => {
113
  //updateInputTable(gpioInputList, gpioLabelList);
114
​
115
  document.querySelectorAll('.form-select').forEach(select => {
116
    select.addEventListener('change', function() {
117
      const gpio = this.getAttribute('data-gpio');
118
      const value = this.value;
119
​
120
      if (value !== '-') {
121
        gpioInputList[gpio] = value;
122
      } else {
123
        delete gpioInputList[gpio];
124
      }
125
​
126
      updateInputTable(); // Update the table
127
    });
128
  });
129
​
130
  document.querySelectorAll('.pinLabel').forEach(cell => {
131
    cell.addEventListener('click', function() {
132
      if (!this.hasAttribute('contentEditable')) {
133
        this.setAttribute('contentEditable', true);
134
        this.focus();
135
      }
136
    });
137
​
138
    cell.addEventListener('blur', function() {
139
      this.removeAttribute('contentEditable');
140
      // Here you can also handle the new value
141
      // For example, send it to the server or process it
142
      const gpio = this.getAttribute('data-gpio');
143
      gpioLabelList[gpio] = this.textContent;
144
      socket.emit(
145
        'cfg_clt_io', {
146
          'gpio': gpio,
147
          'label': this.textContent
148
        });
149
    });
150
​
151
  });
152
​
153
  document.querySelectorAll('.select-container').forEach(container => {
154
    const select = container.querySelector('.form-select');
155
    const label = container.querySelector('.select-label');
156
​
157
    label.addEventListener('click', function() {
158
      select.style.display = 'block';
159
      select.focus();
160
    });
161
​
162
    select.addEventListener('change', function() {
163
      label.textContent = select.options[select.selectedIndex].text;
164
      select.style.display = 'none';
165
    });
166
​
167
    select.addEventListener('blur', function() {
168
      select.style.display = 'none';
169
    });
170
  });
171
​
172
  document.querySelectorAll('.form-select').forEach(select => {
173
    select.addEventListener('change', function() {
174
      const gpio = this.getAttribute('data-gpio');
175
      const value = this.value;
176
      console.log(`GPIO: ${gpio}, Value: ${value}`);
177
      // Here you can handle the association with the GPIO pinA
178
      // Update the list if the value is not '-'
179
      if (value !== '-') {
180
        if (value === 'Input') {
181
          gpioInputList[gpio] = value;
182
        } else if (value === 'Output') {
183
          gpioOutputList[gpio] = value;
184
        }
185
      } else {
186
        // Remove the GPIO from the list if the value is '-'
187
        delete gpioInputList[gpio];
188
        delete gpioOutputList[gpio];
189
      }
190
​
191
      socket.emit(
192
        'cfg_clt_io', {
193
          'gpio': [gpio],
194
          'direction': this.value
195
        });
196
​
197
      console.log(gpioInputList); // for debugging purposes
198
      console.log(gpioOutputList); // for debugging purposes
199
    });
200
  });
201
});
