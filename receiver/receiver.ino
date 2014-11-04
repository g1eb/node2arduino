#include <Servo.h>
Servo myservo;
int fanPin = 8;

void setup() {
  myservo.attach(3);
  pinMode(fanPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("Setup.");
  Serial.println();
}

void loop() {
  while (Serial.available() > 0) {
    Serial.println("Received data");
    String frequency = String(Serial.readStringUntil(';'));
    String polarity = String(Serial.readStringUntil(';'));

    Serial.println("Tweet frequency: " + frequency);
    Serial.println("Polarity: " + polarity);
    Serial.println();

    int force = map (frequency.toInt(), 0, 150, 0, 255);
    int angle = map (polarity.toInt(), -5, 5, 0, 180);
    digitalWrite(fanPin, force);
    myservo.write(angle);
  }
}
