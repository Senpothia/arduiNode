/*
 * Eteindre ou allumer la LED_BUILTIN d'un Arduino en fonction du message reçu
 * d'un navigateur web par l'intermédiaire de Node.js.

 */

void process(unsigned char inChar) {
  switch (inChar) {

     Serial.println(inChar);
    case '0':
      digitalWrite(LED_BUILTIN, LOW);
    //  Serial.println('0');
      break;
    case '1':
      digitalWrite(LED_BUILTIN, HIGH);
    //  Serial.println('1');
      break;
    default:
    ;
     // Serial.print("error");
  }
}

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  while (Serial.available()) {
     unsigned char inChar = (unsigned char)Serial.read();
     process(inChar);
  }
}
