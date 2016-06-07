// NeoPixel Ring simple sketch (c) 2013 Shae Erisson
// released under the GPLv3 license to match the rest of the AdaFruit NeoPixel library

#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif

// Flow sensor
#define FLOW_PIN            2

// Which pin on the Arduino is connected to the NeoPixels?
// On a Trinket or Gemma we suggest changing this to 1
#define PIXEL_PIN            13

// How many NeoPixels are attached to the Arduino?
#define NUMPIXELS      2

#define RESET_MS 4000

// When we setup the NeoPixel library, we tell it how many pixels, and which pin to use to send signals.
// Note that for older NeoPixel strips you might need to change the third parameter--see the strandtest
// example for more information on possible values.
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, PIXEL_PIN, NEO_GRB + NEO_KHZ800);

unsigned long last_flow_change = 0;
unsigned long sequence_start = 0;
char label[16]="Not Attiny85";
bool has_flow=0;
bool announced=false;

void on_change_interrupt() {
  // TODO: check which pin interrupted?
  has_flow = digitalRead(FLOW_PIN) > 0 ? false : true;
  Serial.print("Flow change interrupt");
  Serial.println(has_flow);
  detachInterrupt(digitalPinToInterrupt(FLOW_PIN));
  last_flow_change = millis();
  attachInterrupt(digitalPinToInterrupt(FLOW_PIN), on_change_interrupt, CHANGE);
}

void setup() {
  pinMode(FLOW_PIN, INPUT);

  Serial.begin(9600);
  // This is for Trinket 5V 16MHz, you can remove these three lines if you are not using a Trinket
#if defined (__AVR_ATtiny85__)
  Serial.println('Is __AVR_ATtiny85__');
  label[] = "Attiny85";
  if (F_CPU == 16000000) clock_prescale_set(clock_div_1);
#endif
  // End of trinket special code
  // initialize serial communication at 9600 bits per second:
  pixels.begin(); // This initializes the NeoPixel library.
  attachInterrupt(digitalPinToInterrupt(FLOW_PIN), on_change_interrupt, CHANGE);
}

void loop() {
  unsigned long now = millis();
  if (!announced) {
    announced=true;
    Serial.print(label);
    Serial.println(": starting loop");
  }
  if (has_flow) {
    if (!sequence_start) {
      sequence_start = last_flow_change;
    }
    unsigned long elapsed = now - sequence_start;
    unsigned long ontime = now - last_flow_change;

    Serial.print(now);
    Serial.print(": has_flow: ");
    Serial.print(has_flow);
    Serial.print(", since: ");
    Serial.println(last_flow_change);

    int phase = 0;
    if (elapsed > 1000) {
      phase = 1;
    }
    if (elapsed > 3000) {
      phase = 2;
    }
    if (elapsed > 5000) {
      phase = 3;
    }
    Serial.print("render phase: ");
    Serial.println(phase);

    switch (phase) {
      case 1:
        pixels.setPixelColor(0, pixels.Color(30,0,0));
        pixels.setPixelColor(1, pixels.Color(0,0,0));
        break;
      case 2:
        pixels.setPixelColor(0, pixels.Color(100,150,0));
        pixels.setPixelColor(1, pixels.Color(0,0,0));
        break;
      default:
        pixels.setPixelColor(0, pixels.Color(0,150,150));
        pixels.setPixelColor(1, pixels.Color(0,150,0));
    }
  } else {
    // clear out sequence if enough time has passed
    if (sequence_start && RESET_MS < now - sequence_start) {
      Serial.println("RESET_MS threshold exceeded, reset the sequence");
      sequence_start = 0;
    }
    pixels.setPixelColor(0, pixels.Color(0,0,0));
    pixels.setPixelColor(1, pixels.Color(0,0,0));
  }
  delay(16);
  pixels.show(); // This sends the updated pixel color to the hardware.
}

