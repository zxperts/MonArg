
function updateFeuille2tempsChart(data)  {
  
/*   const data = [["10001", "2023-01-31", "Namur"], ["10000", "2023-01-31", "Namur"], 
  ["100123", "10-05-2021", "Bruxelles"], ["100124", "10-05-2021", "Namur"], 
  ["100125", "10-05-2021", "Hasselt"]]; */

const chartData = {
  dates: [],
  values: [],
  taches: []
};

data.forEach(item => {
  chartData.dates.push(item[1]);
  chartData.values.push(item[0]);
  chartData.taches.push(item[2]);
});

const groupedData = chartData.dates.reduce((acc, date, index) => {
  const tache = chartData.taches[index];
  const value = chartData.values[index];
  
  acc[tache] = acc[tache] || {};
  acc[tache][date] = (acc[tache][date] || 0) + value;
  
  return acc;
}, {});

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const datasets = Object.keys(groupedData).map(tache => {
  const data = [];

  chartData.dates.filter(onlyUnique).forEach(date => {
    data.push(groupedData[tache][date] || 0);
  });
  
  return {
    label: tache,
    data,
    backgroundColor: generateMyColors()
  };
});

const ctx = document.getElementById("myChart").getContext("2d");

const myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: chartData.dates,
    datasets
  },
  options: {
    scales: {
      xAxes: [{
        stacked: true
      }],
      yAxes: [{
        stacked: true
      }]
    }
  }
});

  
  
}


function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

let colorIndex = 0;
function generateMyColors() {
  const colors = [
    "#00429d",
    "#4771b2",
    "#73a2c6",
    "#a5d5d8",
    "#ffffe0",
    "#ffbcaf",
    "#f4777f",
    "#cf3759",
    "#93003a"
  ];
  if (colorIndex === colors.length) {
    colorIndex = 0;
  }
  // const randomIndex = Math.floor(Math.random() * colors.length);
  // return colors[randomIndex];
  return colors[colorIndex++];
}