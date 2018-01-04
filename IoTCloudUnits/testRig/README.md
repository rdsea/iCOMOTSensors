# Test Rig Service

`$ npm install` to install dependencies

`$ npm start` to start the server of port 3000

# API 

- https://URL/rig/
  This will list all avalible devices and their content.  
  Available http commands: GET

  - https://URL/rig/<device>
    This will list the content of a selected device and underlaying methods.
    Available http commands: GET
    - "in motion"
    A boolean flag, true if the device in motion and therefor wont accept any PUT commands.
    - https://URL/rig/<device>/voltage
      A device (currently only cart_1) can alter the voltage on it's tracker tag in order to simulate power failure.
      Note that the tag that is attached to the dynamic power source is not necessarily the same that is tethered to 
      the cart_1, it's just here for legacy reasons.
      Available http commands: GET, PUT
      json data:
      {
        "volt": <float value>
      }
      
    - https://URL/rig/<device>/position
      this method can be used for both monitoring the position of a device and to set a new position.
      Available http commands: GET, PUT
      json data:
      {
        "lat": <meters float>, 
        "lon": <meters float>
      }
      
    - https://URL/rig/<device>/move
      A method for moving a device in a specific speed and time. The speed represents the target speed of the movement,
      there will be acceleration and break included in the duration.(Note that only speed.x and duration is effective)
      Available http commands: GET, PUT
      json data:
         {
            "direction": {
                "x": <radian float>,
                "y": <radian float>,
                "z": <radian float>
            }, 
            "duration": <seconds float>,
            "speed": {
                "x": <meters/second float>,
                "y": <meters/second float>,
                "z": <meters/second float>
            }
        }

    - https://URL/rig/<device>/heartrate
      Set heart rate in pulse simulator
      json data:
      Available http commands: GET, PUT
        {
            "bpm": 65
        }
    - https://URL/rig/<device>/distance
      A list of distance calculators/setters
      Available http commands: GET

      - https://URL/rig/<device>/distance/<other device>
        Get or set distance between objects. when setting a distance the devices will go to a position half the 
        distance from the middle of the rig each.
        Available http commands: GET, PUT
        json data:
        {
            "distance": <meters float>
        }
  - https://URL/rig/init_devices
    Runs the carts on the rig back to position zero. It's a good idea to run this command before every session since 
    it also calibrates the rig.
    Available http commands: GET, PUT
      json data:
      {}
  - https://URL/rig/L001/turn_locator/
    turn/rotate one of the locators (L001) from 0 to 1 π radians
    Available http commands: GET, PUT
      json data:
      {
          "radian": <π radian float>
      }
      
      
- https://URL/sut
  This will list all avalible devices and their content.  
  Available http commands: GET

  - https://URL/sut/locators/
    specific Quuppa locator information
    Available http commands: GET
    - https://URL/sut/locators/block_locators/
      block all incomming traffic from the locators listed in "blocklist" for the duration of "blockTime" seconds. this
      will cause the qpe-system to lose connection thus decrease the accuracy of the positioning system.
      Available http commands: PUT
        {
            "blockList": [
                "<locator name>" [,"<locator name n>"]
            ], 
            "blockTime": <second float>
        }
  - https://URL/sut/<device>/position
    Similiar to the rig dito, but read only, this will show you where the SUT estimates the tracker to be.
    Available http commands: GET
      {
          "lat": <meters float>, 
          "lon": <meters float>,
          "height": <meters float, 
          "Accuracy": <meters float>, 
      }
  - https://URL/sut/<device>/heartrate
    get the heartrate from a HRM equiped device
    Available http commands: GET
      {
        "bpm": <beats per minute integer>
      }
  - https://URL/sut/<device>/voltage
    Get the battery voltage from the device
    Available http commands: GET
    json data:
     {
        "volt": <voltage float>
     }

  - https://URL/sut/<device>/distance/
      a list of devices to measure distance to.
    - https://URL/sut/<device>/distance/<other device>
      measuers the distance between two devices ("device" and "other device") using Pythagorean theorem over the positions.
      Available http commands: GET
      {
         "distance": <meters float>
      }
  - https://URL/sut/reboot_system/
    a PUT to this method will reboot the tracking system (i.e Quuppa), a get will return an empty dictionary {}
    Available http commands: GET, PUT
    json data:
    {}
 