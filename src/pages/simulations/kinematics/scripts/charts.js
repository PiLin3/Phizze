const canvasContainer = document.querySelector('.canvas-container');

Chart.defaults.font.weight = 'bold';
const reset = 0;
let varLabels = [reset];
// Charts data
const posData = {
  labels: varLabels,
  datasets: [{
    label: 'Position',
    data: [0] // this is the actual data
  }]
};
const velData = {
  labels: varLabels,
  datasets: [{
    label: 'Velocity',
    data: [] // this is the actual data
  }]
};
const accData = {
  labels: varLabels,
  datasets: [{
    label: 'Acceleration',
    data: [] // this is the actual data
  }]
};
// Charts configurations

// Position chart configuration
const posConfig = {
  type: 'line',
  data: posData,
  options: {
    scales: {
      xlabels: {
        type: 'linear',
        title: {
          display: true,
          text: 'Time (s)',
          align: 'end'
        },
        ticks: {
          font: {
            size: 10
          }
        },
        beginAtZero: true
      },
      y: {
        title: {
          display: true,
          text: 'Distance (m)',
          align: 'end'
        },
        ticks: {
          font: {
            size: 10
          }
        },
        beginAtZero: true,
        min: 0,
        max: 10
      }
    },
    datasets: {
      line: {
        pointRadius: 1, // disable for all `'line'` datasets
        borderWidth: 2.5,
        borderColor: 'rgba(50, 170, 230, 0.3)',
        backgroundColor: 'rgba(50, 170, 230, 0.7)'
      }
    },
    plugins: {
      legend: {
        labels: {
          boxWidth: 12
        }
      },
      tooltip: {
        mode: 'point',
        displayColors: false,
        callbacks: {
          title: () => {},
          label: (id) => {return `Position ${id.formattedValue} m`},
          afterLabel: (id) => {return `Time ${id.label} s`},
        }
      } 
    },
    maintainAspectRatio: false
  }
};
// Velocity chart configuration
const velConfig = {
  type: 'line',
  data: velData,
  options: {
    scales: {
      xlabels: {
        type: 'linear',
        title: {
          display: true,
          text: 'Time (s)',
          align: 'end'
        },
        ticks: {
          font: {
            size: 10
          }
        },
        beginAtZero: true
      },
      y: {
        title: {
          display: true,
          text: 'Velocity (m/s)',
          align: 'end'
        },
        ticks: {
          font: {
            size: 10
          }
        },
        beginAtZero: true,
        min: 0,
        max: 10
      }
    },
    datasets: {
      line: {
        pointRadius: 1, // disable for all `'line'` datasets
        borderWidth: 2.5,
        borderColor: 'rgba(50, 170, 230, 0.3)',
        backgroundColor: 'rgba(50, 170, 230, 0.7)'
      }
    },
    plugins: {
      legend: {
        labels: {
          boxWidth: 12
        }
      },
      tooltip: {
        mode: 'point',
        displayColors: false,
        callbacks: {
          title: () => {},
          label: (id) => {return `Velocity ${id.formattedValue} m/s`},
          afterLabel: (id) => {return `Time ${id.label} s`}
        }
      } 
    },
    maintainAspectRatio: false
  }
};
// Acceleration chart configuration
const accConfig = {
  type: 'line',
  data: accData,
  options: {
    scales: {
      xlabels: {
        type: 'linear',
        title: {
          display: true,
          text: 'Time (s)',
          align: 'end'
        },
        ticks: {
          font: {
            size: 10
          }
        },
        beginAtZero: true
      },
      y: {
        title: {
          display: true,
          text: 'Acceleration (m/s\u00B2)',
          align: 'end'
        },
        ticks: {
          font: {
            size: 10
          }
        },
        beginAtZero: true,
        min: 0,
        max: 10
      }
    },
    datasets: {
      line: {
        pointRadius: 1, // disable for all `'line'` datasets
        borderWidth: 2.5,
        borderColor: 'rgba(50, 170, 230, 0.3)',
        backgroundColor: 'rgba(50, 170, 230, 0.7)'
      }
    },
    plugins: {
      legend: {
        labels: {
          boxWidth: 12
        }
      },
      tooltip: {
        mode: 'point',
        displayColors: false,
        callbacks: {
          title: () => {},
          label: (id) => {return `Acceleration ${id.formattedValue}` + ' m/s\u00B2'},
          afterLabel: (id) => {return `Time ${id.label} s`}
        }
      } 
    },
    maintainAspectRatio: false
  }
};

// Create charts
const posChart = new Chart(document.getElementById('posChart'), posConfig);
const velChart = new Chart(document.getElementById('velChart'), velConfig);
const accChart = new Chart(document.getElementById('accChart'), accConfig);
// Reset all charts
export function resetCharts() {
  // Reset the data points to zero
  posChart.config.data.datasets[0].data = [0];
  velChart.config.data.datasets[0].data = [];
  accChart.config.data.datasets[0].data = [];
  // Reset the x axis
  varLabels = [reset];
  posChart.config.data.labels = varLabels;
  velChart.config.data.labels = varLabels;
  accChart.config.data.labels = varLabels;
  // Reset the y axis values to default
  posChart.config.options.scales.y.max = 10;
  velChart.config.options.scales.y.max = 10;
  accChart.config.options.scales.y.max = 10;
  // Update the charts
  posChart.update();
  velChart.update();
  accChart.update();
}
export function updateCharts(position, velocity, acceleration, xAxisIndex) {
  posChart.config.data.datasets[0].data.push(position);
  velChart.config.data.datasets[0].data.push(velocity);
  accChart.config.data.datasets[0].data.push(acceleration);
  // Cheack position chart axis
  if (position > 10) {
    posChart.config.options.scales.y.max = (Math.ceil(position));
  }
  // Cheack velocity chart axis
  if (velocity > 10) {
    velChart.config.options.scales.y.max = (Math.ceil(velocity));
  }
  // Cheack acceleration chart axis
  if (acceleration > 10) {
    accChart.config.options.scales.y.max = (Math.ceil(acceleration));
  }
  varLabels.push(xAxisIndex);
  posChart.update();
  velChart.update();
  accChart.update();
}
// Set initial values for velocity and acceleration. 
export function setInititalValues(initialVelocity, acceleration) {
  velChart.config.data.datasets[0].data.push(initialVelocity);
  accChart.config.data.datasets[0].data.push(acceleration);
}

canvasContainer.addEventListener('click', (e) => {
  if (e.target.hasAttribute('data-shrinked')){
    if(e.target.getAttribute('data-shrinked') == 'false'){
      e.target.parentElement.classList.add('shrink');
      e.target.setAttribute('data-shrinked', 'true');
    }else{
      e.target.parentElement.classList.remove('shrink');      
      e.target.setAttribute('data-shrinked', 'false');
    }
  }
})