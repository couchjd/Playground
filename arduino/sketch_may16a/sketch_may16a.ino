int lm35Pin = A0;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  int analogValue;
  float temperature;

  analogValue = analogRead(lm35Pin);

  temperature = (float(analogValue)/1023)*5000;

  Serial.print("Temp: ");
  Serial.print(temperature);
  Serial.println(" C");

  delay(1000);  
}
