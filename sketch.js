var ElecQdata = null;
var font;

function preload() {
  font = loadFont('BMEULJIROTTF.ttf')
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  var url = 'http://openapi.seoul.go.kr:8088/62724845716d616d3731494d586c45/json/octastatapi378/1/26';
  loadJSON('electricUsage.json', onElecQ);
  textSize(10);
  textFont(font);
  textAlign(LEFT, TOP);
  noStroke();

}

function draw() {
  background(mouseY/30);
  if (ElecQdata == null) return;
  translate(width / 2, height / 2);
  var nDist = ElecQdata.list_total_count;
  var angStep = TWO_PI / 25
  var maxElecQ = 100,
    minElecQ = 500000;

  console.log(ElecQdata.row[1].HAPGYE)
  console.log(ElecQdata.row[1].HAPGYE)

  for (var i = 1; i < nDist; i++) {

    if (isNaN(ElecQdata.row[i].HAPGYE)) {
      continue;
    }
    maxElecQ = max(ElecQdata.row[i].HAPGYE, maxElecQ);
    minElecQ = min(ElecQdata.row[i].HAPGYE, minElecQ);
  }

  var angOffset = map(mouseX, 0, width, 0, TWO_PI);
  var scaleSz = map(mouseY, 0, height, 1, 2);
  for (var i = 1; i < nDist; i++) {
    push();
    stroke(255);
    rotate(angStep * i + angOffset);
    scale(scaleSz);
    if (isNaN(ElecQdata.row[i].HAPGYE)) {
      fill(127);
      text("No Data", 80, 0);
      text(ElecQdata.row[i].JIYEOK, 200, 0);
    } else {
      var red = map(ElecQdata.row[i].HAPGYE, minElecQ, maxElecQ, 0, 255);
      red = constrain(red, 0, 255);
      fill(255 - red, 50, 200);
      stroke(255 - red, 50, 255);
      strokeWeight(3);
      arc(0, 0, ElecQdata.row[i].HAPGYE * 3 / 30000 * 2, ElecQdata.row[i].HAPGYE * 3 / 30000 * 2, 0, TWO_PI / nDist, PIE);

      push();
      rotate(TWO_PI / nDist / 2)
      noStroke();
      text(ElecQdata.row[i].JIYEOK, ElecQdata.row[i].HAPGYE * 3 / 30000 + 10, -5);
      fill(0);
      textSize(map(ElecQdata.row[i].HAPGYE, minElecQ, maxElecQ, 2, 12));
      textAlign(CENTER, CENTER);
      text(ElecQdata.row[i].HAPGYE, ElecQdata.row[i].HAPGYE * 3 / 30000 / 2 + 10, 0);
      noFill();
      stroke(255);
      strokeWeight(1);
      ellipse(0, 0, maxElecQ * 3 / 30000 * 2 + 80, maxElecQ * 3 / 30000 * 2 + 80);
      pop();
    }
    pop();
  }
  push();
  fill(255, 255);
  ellipse(0, 0, 90, 90);
  fill(0);
  textAlign(CENTER, CENTER);
  text('서울시\n지역별 합계\n전력사용량\n' + str(ElecQdata.row[0].HAPGYE) + ' MWh', 0, 0)
  pop();

  push();
  translate(-width / 2, -height / 2);
  for (i = 0; i < 6; i++) {

    fill(255 - (i + 1) * 255 / 6, 50, 200);
    rect(i * 20 + width / 2 + 140, height / 1.2 + 20, 20, 20);
  }
  fill(255);
  textAlign(CENTER);
  text('낮음', width / 2 + 150, height / 1.2 + 45);
  text('높음', width / 2 + 250, height / 1.2 + 45);
  fill(200);
  textSize(8);
  text('출처: 한국전력공사 서울시 용도별 전력 사용량', width / 2 + 200, height / 1.2 + 65);
  pop();

}

function onElecQ(data) {
  ElecQdata = data.octastatapi378;
}