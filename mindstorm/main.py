#!/usr/bin/env pybricks-micropython
from pybricks.hubs import EV3Brick
from pybricks.ev3devices import Motor, TouchSensor, UltrasonicSensor
from pybricks.parameters import Port, Stop
from pybricks.tools import wait, StopWatch

# Initialize the EV3 Brick
ev3 = EV3Brick()

# Initialize your 4 motors
rear_motor = Motor(Port.A)
front_right_motor = Motor(Port.B)
front_left_motor = Motor(Port.C)
rotary_motor = Motor(Port.D) # Mace motor!

# Initialize the Sensors
button_1 = TouchSensor(Port.S1)
button_4 = TouchSensor(Port.S4)
distance_sensor = UltrasonicSensor(Port.S3) # Added your new Port 3 sensor!

# Set base speeds and durations
speed = 400
macespeed = 2500
turn_duration = 1100 # Approx time for a 90-degree turn

# Initialize the timer
timer = StopWatch()

ev3.speaker.beep()
print("Starting up... You have 90 seconds!")

# 90,000 milliseconds = 90 seconds
while timer.time() < 90000:
    
    # --- SENSOR LOGIC: Detect objects within 1 foot (~305 mm) ---
    if distance_sensor.distance() < 305:
        print("Obstacle detected! Backing up...")
        
        # Back up for 1 second (Keep the mace spinning!)
        rear_motor.run_time(-speed, 1000, then=Stop.HOLD, wait=False)
        front_right_motor.run_time(-speed, 1000, then=Stop.HOLD, wait=False)
        rotary_motor.run_time(macespeed, 1000, then=Stop.HOLD, wait=False)
        front_left_motor.run_time(-speed, 1000, then=Stop.HOLD, wait=True)
        
        print("Turning Right 90 degrees...")
        # Turn Right
        rear_motor.run_time(speed, turn_duration, then=Stop.HOLD, wait=False)
        front_right_motor.run_time(-speed, turn_duration, then=Stop.HOLD, wait=False)
        front_left_motor.run_time(speed, turn_duration, then=Stop.HOLD, wait=True)
        
        print("Evasion complete. Resuming forward drive...")

    # --- BUTTON 1 LOGIC: Turn Right, Drive 3.5s ---
    elif button_1.pressed():
        print("Button 1 pressed! Turning Right...")
        
        rear_motor.run_time(speed, turn_duration, then=Stop.HOLD, wait=False)
        front_right_motor.run_time(-speed, turn_duration, then=Stop.HOLD, wait=False)
        front_left_motor.run_time(speed, turn_duration, then=Stop.HOLD, wait=True)
        
        print("Driving forward for 3.5 seconds...")
        
        rear_motor.run_time(speed, 3500, then=Stop.HOLD, wait=False)
        front_right_motor.run_time(speed, 3500, then=Stop.HOLD, wait=False)
        rotary_motor.run_time(macespeed, 3500, then=Stop.HOLD, wait=False)
        front_left_motor.run_time(speed, 3500, then=Stop.HOLD, wait=True)
        
    # --- BUTTON 4 LOGIC: Turn Left, Drive 2.5s ---
    elif button_4.pressed():
        print("Button 4 pressed! Turning Left...")
        
        rear_motor.run_time(speed, turn_duration, then=Stop.HOLD, wait=False)
        front_right_motor.run_time(speed, turn_duration, then=Stop.HOLD, wait=False)
        front_left_motor.run_time(-speed, turn_duration, then=Stop.HOLD, wait=True)
        
        print("Driving forward for 2.5 seconds...")
        
        rear_motor.run_time(speed, 2500, then=Stop.HOLD, wait=False)
        front_right_motor.run_time(speed, 2500, then=Stop.HOLD, wait=False)
        rotary_motor.run_time(macespeed, 2500, then=Stop.HOLD, wait=False)
        front_left_motor.run_time(speed, 2500, then=Stop.HOLD, wait=True)

    # --- DEFAULT LOGIC: Move Forward ---
    else:
        # If no buttons are pressed and no obstacles are near, just keep driving!
        # .run() turns the motors on indefinitely until told to stop
        rear_motor.run(speed)
        front_right_motor.run(speed)
        front_left_motor.run(speed)
        rotary_motor.run(macespeed)
        
    wait(10)

# --- PROGRAM END ---
# We must explicitly stop the motors now, because .run() leaves them running!
rear_motor.stop()
front_right_motor.stop()
front_left_motor.stop()
rotary_motor.stop()

ev3.speaker.beep(500, 1000)
print("90 seconds are up! Match over.")