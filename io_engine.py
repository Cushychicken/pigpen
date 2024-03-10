import json
import jsonschema
from jsonschema import validate
#import RPi.GPIO as GPIO
#import smbus

# Define the JSON schema for validating the input
schema = {
    "type": "object",
    "properties": {
        "type": {"type": "string", "enum": ["GPIO", "I2C"]},
        "pin": {"type": "integer"},
        "mode": {"type": "string", "enum": ["input", "output", "write", "read"]},
        "state": {"type": "string", "enum": ["high", "low", None]},
        "address": {"type": "integer"},
        "data": {"type": "integer"}
    },
    "required": ["type"]
}

# Function to set GPIO state
def set_gpio_state(pin, mode, state):
    print(f"Pin {pin} set to {mode} with state {state}")

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
        print(f"I2C: Wrote {data} to address {address}")
    elif mode == "read":
        #received_data = bus.read_byte(address)
        print(f"I2C: Read {received_data} from address {address}")
        #return received_data

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
    except jsonschema.exceptions.ValidationError as e:
        print(f"Validation error: {e.message}")
    except Exception as e:
        print(f"Error: {e}")

# Example usage
if __name__ == "__main__":
    # Sample JSON objects
    gpio_json = {"type": "GPIO", "pin": 17, "mode": "output", "state": "high"}
    i2c_json = {"type": "I2C", "address": 0x48, "mode": "write", "data": 0xFF}

    # Process the JSON objects
    process_json(gpio_json)
    process_json(i2c_json)

