var LinePloter={
    plot: function plot(title, data, label){
        var ctx = document.getElementById(title).getContext('2d');
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: label,
            datasets: [{
              label: 'code lines',
              data: data,
              backgroundColor: "rgba(153,255,51,0.6)"
            }]
          },
          options:{
            title: {
              display: true,
              text: title
            }
          }
        });
    },

};
var BarPloter={
  plot: function plot(title, data, label){
      var ctx = document.getElementById(title).getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: label,
          datasets: [{
            label: 'code lines',
            data: data,
            backgroundColor: "rgba(153,255,51,0.6)"
          }]
        },
        options:{
          title: {
            display: true,
            text: title
          }
        }
      });
  },
  
}