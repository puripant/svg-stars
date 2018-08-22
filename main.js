const indexNum = 5;

const margin = {top: 35, right: 70, bottom: 30, left: 70};
const width = 600;
const height = 400;

const svg = d3.select("svg")
  .style("width", width + "px")
  .style("height", height + "px");

// const color = d3.scaleOrdinal()
//   .range(["#DB7F85", "#50AB84", "#4C6C86", "#C47DCB", "#B59248", "#DD6CA7", "#E15E5A", "#5DA5B3", "#725D82", "#54AF52", "#954D56"]);

let scales = [];
for (let i = 0; i < indexNum; i++) {
  scales.push(d3.scaleLinear()
    .range([10, 20]));
}

const piOverFive = Math.PI / 5;
const rotateScaleVector = function(vector, angle, scale) {
  return {
    x: (vector.x * Math.cos(angle) - vector.y * Math.sin(angle)) * scale,
    y: (vector.x * Math.sin(angle) + vector.y * Math.cos(angle)) * scale
  };
};
const drawStar = function(d, i) {
  let str = "";
  for (let j = 0; j < d.length; j++) {
    str += (d[j].x + ((i%5 + 1)*100)) + "," + (d[j].y + (100*(Math.floor(i/5) + 1))) + " ";
  }
  return str;
};

d3.csv("data.csv", function(error, data) {
  //dummy data
  data = [];
  for (let i = 0; i < 15; i++) {
    data[i] = {
      region: i,
      index0: Math.random(),
      index1: Math.random(),
      index2: Math.random(),
      index3: Math.random(),
      index4: Math.random()
    };
  }

  let stars = [];
  for (let i = 0; i < indexNum; i++) {
    scales[i].domain(d3.extent(data, function(d) { return +d["index" + i]; }));
  }
  for (let r = 0; r < data.length; r++) {
    stars[r] = [];
    for (let i = 0; i < indexNum; i++) {
      stars[r].push(rotateScaleVector({ x: 0, y: -1 },  2*i   *piOverFive, scales[i](+data[r]["index" + i])));
      stars[r].push(rotateScaleVector({ x: 0, y: -1 }, (2*i+1)*piOverFive, 10));
    }
  }

  svg.selectAll("g")
      .data(stars)
    .enter().append("polygon")
      .attr("points", drawStar)
      .attr("fill", "gold")
      .attr("stroke", "gold")
      .attr("stroke-width", 10)
      .attr("stroke-linejoin", "round");

});
