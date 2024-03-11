# pigpen

Pigpen is an HTTP Gateway to Hardware Interfaces on a Raspberry Pi. It's an easy way to talk to GPIO, sensors, peripheral devices like Bluetooth radios or cellular modems, buses, memory chips, and much more. 

It's a great way to interact with your low level hardware thru a browser client, a Python CLI, or `curl` calls.

![our mascot](img/pigpen.png)

# Who's this for?

Primarily, me: Nash Reilly, aka @cushychicken. 

I wanted a way to boop around with sensors and arbitrary peripheral ICs without recalling a bunch of boilerplate Python code. 

I could see this also being useful for:
* impatient people like me who want some graphical SPI/UART/I2C consoles, 
* test engineers who want to instrument an embedded project with an RPi,
* startuppy sorts who want to integrate hardware-in-the-loop testing with their CI machines.

I kind of just wanted a GUI for this. I don't really know why. I just think they're neat.

# Roadmap

- Detect input IO pin state changes from browser client
- Set and clear output IO on an RPi from browser based calls
- Save "Profiles"
  - Preconfigured settings of GPIO states and labels that can be recalled and applied
  - Think like Saleae's sessions, but just for GPIO labels and direction / peripheral associations 
- Trigger I2C actions and SPI actions from the browser client
- Send UART data from the browser call
- Update the browser client with Received UART data
  - Render a UART console in the browser window? 
- Chain a series of IO actions together into "Workflows", e.g.:
  - Set IO from low to high (release a chip from reset)
  - Write to the chip from SPI or I2C to configure it
  - Monitor an IO (e.g. interrupt line)
  - Read from SPI / I2C to get data and clear interrupt

