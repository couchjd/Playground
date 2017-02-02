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
  range = map(analogValue, sensorMin, sensorMax, 0, 3);

  switch(range){
    case 0:
      digitalWrite(outPin, LOW);
      Serial.println("dark");
      break;
    case 1:
      digitalWrite(outPin, HIGH);
      Serial.println("dim");
      break;
    case 2:
      digitalWrite(outPin, HIGH);
      Serial.println("medium");
      break;
    case 3:
      digitalWrite(outPin, HIGH);
      Serial.println("bright");
      break;
  }
  delay(250);
}
