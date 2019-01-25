const indexNum = 5;

const margin = {top: 50, right: 50, bottom: 50, left: 50};
const width = 2000 - margin.left - margin.right;
const height = 70 - margin.top - margin.bottom;

const svg = d3.select("svg")
    .style("width", width + margin.left + margin.right)
    .style("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const data_filename = "wdvp-indices.csv";
const idIndexName = "name"
const heightIndexName = "population";
const indexNames = ["gini-inversed", "happyplanet", "hdi", "worldhappiness", "sustainable"];

let xScale = d3.scaleLinear()
  .range([0, width]);
let yScale = d3.scaleLinear()
  .range([0, height]);
let colorScale = d3.scaleLinear()
  .domain([0, 1])
  .range(["gold", "red"]);
starSize = { min: 5, max: 10 };
let scales = [];
for (let i = 0; i < indexNum; i++) {
  scales.push(d3.scaleLinear()
    .range([starSize.min, starSize.max]));
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
  for (let j = 0; j < d.points.length; j++) {
    str += (+d.points[j].x + xScale(i)) + "," + (+d.points[j].y + d.height) + " ";
  }
  return str;
};

d3.csv(data_filename, function(error, data) {
  xScale.domain([0, data.length-1]);
  yScale.domain([0, 1]); // ([0, d3.max(data, function(d) { return +d[heightIndexName]; })]);
  for (let i = 0; i < indexNum; i++) {
    scales[i].domain(d3.extent(data, function(d) { return +d[indexNames[i]]; }));
  }

  let stars = [];
  for (let r = 0; r < data.length; r++) {
    stars.push({
      id: data[r][idIndexName],
      height: yScale(+data[r][heightIndexName] > 5000000),
      color: colorScale(+data[r][heightIndexName] > 5000000),
      points: []
    });
    for (let i = 0; i < indexNum; i++) {
      stars[r].points.push(rotateScaleVector({ x: 0, y: -1 },  2*i   *piOverFive, scales[i](+data[r][indexNames[i]])));
      // stars[r].points.push(rotateScaleVector({ x: 0, y: -1 }, 2*i * piOverFive, starSize.max));
      stars[r].points.push(rotateScaleVector({ x: 0, y: -1 }, (2*i+1)*piOverFive, starSize.min));
    }
  }

  svg.selectAll("g")
      .data(stars) //.data(stars.sort(function(a, b) { return d3.ascending(a.height, b.height); }))
    .enter().append("polygon")
      .attr("id", d => d.id)
      .attr("points", drawStar)
      .attr("fill", d => d.color)
      .attr("stroke", d => d.color)
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .on("mouseover", function(d) {
        console.log(d.id);
      });

});
