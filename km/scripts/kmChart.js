
function updateKmChart(data)  {

  convertTableToCards();
  
  /* 
  var data = [["10001", "2023-01-31", "Namur"], ["10000", "2023-01-31", "Namur"], 
  ["100123", "10-05-2021", "Bruxelles"], ["100124", "10-05-2021", "Namur"], 
  ["100125", "10-05-2021", "Hasselt"]];
  */
  var labels = [];
  var values = [];
  var locationColors = {};
  var colorPool = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'];
  var colors = [];

  
  data.forEach(function(dat) {
    labels.push(dat[1]);
    values.push(dat[0]);
    if (!locationColors.hasOwnProperty(dat[2])) {
      locationColors[dat[2]] = colorPool[Object.keys(locationColors).length % colorPool.length];
    }
    colors.push(locationColors[dat[2]]);
    
  });
  
  var ctx = document.getElementById('myChart').getContext('2d');
  var chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Kilométres',
        data: values,
        backgroundColor: 'rgba(54, 162, 235, 0.2)', /* colors, */
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false
          }
        }]
      }
    }
  });
  
  
}