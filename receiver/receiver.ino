String tweets;
String polarity;

void setup() {
    Serial.begin(9600);
}
 
void loop() {
    while (Serial.available() > 0) {
        tweets = Serial.readStringUntil(';');
        polarity = Serial.readStringUntil(';');
        
        Serial.println("Num tweets: "+tweets);
        Serial.println("Polarity: "+polarity);
    }
}
