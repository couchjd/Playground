const int sensorMin = 0;
const int sensorMax = 800;

int photocellPin = A0;
int outPin = 7;

void setup() {
  pinMode(outPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int analogValue;
  int range;

  analogValue = analogRead(photocellPin);
  Serial.println(analogValue);

  if((analogValue > 2) && (analogValue <= 5)){
    digitalWrite(outPin, LOW);
  }
  else{
    digitalWrite(outPin, HIGH);
  }

  delay(100);
}
