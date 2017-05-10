import RPi.GPIO as GPIO
import picamera
from time import sleep
import requests
from requests_toolbelt.multipart.encoder import MultipartEncoder
import sys, os

def rc_time (pim_to_circuit):
    count = 0

    GPIO.setup(pin_to_circuit, GPIO.OUT)
    GPIO.output(pin_to_circuit, GPIO.LOW)

    sleep(0.1)

    GPIO.setup(pin_to_circuit, GPIO.IN)

    while(GPIO.input(pin_to_circuit) == GPIO.LOW):
        count += 1

    print(count)

    return count


camera = picamera.PiCamera()
GPIO.setmode(GPIO.BOARD)

period_in_seconds = 1

const_path = '/home/pi/Desktop/Pictures for the server'
stop = False
number_of_picture = 1
pin_to_circuit = 7
http_address = 'http://' + str(sys.argv[1])
files = [f for f in os.listdir(const_path)]
for f in files;
    os.remove(const_path + '/' + f)

while(stop == False):
    print('Waiting')
    sleep(period_in_seconds)
    print('Done waiting')
    if rc_time(pin_to_circuit) < 55000:
        print('+ 1 picture')
        camera.capture(const_path + '/image' + str(number_of_picture) + '.jpg')
        with open(const_path + '/image' + str(number_of_picture) + '.jpg', 'rb') as f:
            m = MultipartEncoder({'file': f.name, f, 'image/jpeg'})
            headers = {'content-type': 'application/json'}
            r = requests.post(http_address + ':8081/file_upload', data=m, header = headers)

        number_of_picture += 1

GPIO.cleanup()
