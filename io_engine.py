import json
import jsonschema
from jsonschema import validate
#import RPi.GPIO as GPIO
#import smbus

# Define the JSON schema for validating the input
schema = {
    "type": "object",
    "properties": {
        "type": {"type": "string", "enum": ["GPIO", "I2C", "SPI"]},
        "pin": {"type": "integer"},
        "mode": {"type": "string", "enum": ["input", "output", "write", "read"]},
        "state": {"type": "string", "enum": ["high", "low", None]},
        "address": {"type": "integer"},
        "data": {
            "anyOf": [
                {"type": "integer"},
                {
                    "type": "array",
                    "items": {"type": "integer"}
                }
            ]
        },
        "bus": {"type": "integer"},
        "device": {"type": "integer"}
    },
    "required": ["type"]
}

# Function to set GPIO state
def set_gpio_state(pin, mode, state):
    print(f"[GPIO]: Pin {pin} set to {mode} with state {state}")

    """
    GPIO.setmode(GPIO.BCM)
    if mode == "output":
        GPIO.setup(pin, GPIO.OUT)
        if state == "high":
            GPIO.output(pin, GPIO.HIGH)
        else:
            GPIO.output(pin, GPIO.LOW)
    elif mode == "input":
        GPIO.setup(pin, GPIO.IN)
        # Additional logic for input mode can be added here
    print(f"Pin {pin} set to {mode} with state {state}")
    """

# Function to handle I2C traffic
def handle_i2c(address, mode, data=None):
    #bus = smbus.SMBus(1)  # 1 indicates /dev/i2c-1
    if mode == "write":
        #bus.write_byte(address, data)
        print(f"[I2Cw]: Wrote {data} to address {address}")
    elif mode == "read":
        #received_data = bus.read_byte(address)
        print(f"[I2Cr]: Read {received_data} from address {address}")
        #return received_data

# Function to handle SPI traffic
def handle_spi(bus, device, mode, data):
    #spi = spidev.SpiDev()
    #spi.open(bus, device)
    if mode == "write":
        if isinstance(data, list):
            #spi.xfer2(data)
            print(f"[SPI ]: Wrote {data} to bus {bus}, device {device}")
        else:
            #spi.xfer2([data])
            print(f"[SPI ]: Wrote {data} to bus {bus}, device {device}")
    elif mode == "read":
        # Reading from SPI devices typically requires writing a command first
        # You may need to adjust this logic based on your specific device
        #received_data = spi.xfer2([data])
        print(f"SPI: Read {received_data} from bus {bus}, device {device}")
        #return received_data
    #spi.close()

# Function to process the JSON object
def process_json(json_object):
    try:
        # Validate the JSON object against the schema
        validate(instance=json_object, schema=schema)

        io_type = json_object["type"]
        if io_type == "GPIO":
            pin = json_object["pin"]
            mode = json_object["mode"]
            state = json_object.get("state")
            set_gpio_state(pin, mode, state)
        elif io_type == "I2C":
            address = json_object["address"]
            mode = json_object["mode"]
            data = json_object.get("data")
            handle_i2c(address, mode, data)
        elif io_type == "SPI":
            bus = json_object["bus"]
            device = json_object["device"]
            mode = json_object["mode"]
            data = json_object["data"]
            handle_spi(bus, device, mode, data)
    except jsonschema.exceptions.ValidationError as e:
        print(f"Validation error: {e.message} for {json_object=}")
    except Exception as e:
        print(f"Error: {e}")

# Example usage
if __name__ == "__main__":
    # Sample JSON objects
    gpio_json = {"type": "GPIO", "pin": 17, "mode": "output", "state": "high"}
    i2c_json = {"type": "I2C", "address": 0x48, "mode": "write", "data": 0xFF}
    spi_json = {"type": "SPI", "bus": 0, "device": 0, "mode": "write", "data": [0x01, 0x02, 0x03]}


    # Process the JSON objects
    process_json(gpio_json)
    process_json(i2c_json)
    process_json(spi_json)
