var init_chart=false;

var cart_1;
var cart_2;


function mod_charts(d_1, d_2, d_3){
	if(init_chart == false)
	{
		setup_charts();
		init_chart=true;
	}
	
	cart_1.data.datasets[0].data = d_2;
	cart_1.data.datasets[1].data = d_1;
	cart_1.update();
	
	cart_2.data.datasets[0].data = d_3;
	cart_2.update();

}

function plot_chart(d_1, d_2, d_3)
{
	mod_charts(d_1, d_2, d_3);
}

function clear_chart_plot()
{
	mod_charts([], [], []);
}

function setup_charts()
{
		const all_labels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120];
		
		const zero_data = new Array(121).fill(0);
	cart_1 = new Chart("pharma_plot", {
	  type: "line",
	  data: {
		datasets: [
		{ 
			label: 'Cp (µg/ml)',
		  borderColor: '#81b586',
		  backgroundColor: '#81b586',
		  fill: false,
		  pointRadius: 0,
		},
		{ 
			label: 'Ce (µg/ml)',
		  borderColor: '#cf6569',
		  backgroundColor: '#cf6569',
		  fill: false,
		  pointRadius: 0,
		},
		],
		labels: all_labels,
		},

	  options: {
		  tooltips: {
			enabled: false
			},
			hover: {mode: null},
		legend: {display: true, onClick: (e) => e.stopPropagation()},
		animation: false,
			scales: {
				xAxes: [{
				ticks: {
					autoSkip: true,
					maxTicksLimit: 13,
					callback: function(value, index, ticks) {
							return '+' + value + ' min';
						},
				},
				}],
			yAxes: [{
			id: 'A',
			type: 'linear',
			position: 'left',
			color: '#cf6569',
			ticks: {
				maxTicksLimit: 5,
				autoSkip: true,
				callback: function(value, index, ticks) {
							return + String(Math.round((value + Number.EPSILON) * 100) / 100) + ' µg/ml';
						},
			}
			}],
			},
	  }
	});
	
	cart_2 = new Chart("pharma_plot_2", {
	  type: "line",
	  data: {
		datasets: [
		{ 
			label: 'TOF (%)',
		  borderColor: '#628bbd',
		  backgroundColor: '#628bbd',
		  fill: false,
		  pointRadius: 0,
		}
		],
		labels: all_labels,
		},

	  options: {
		  tooltips: {
			enabled: false
			},
			hover: {mode: null},
		legend: {display: true, onClick: (e) => e.stopPropagation()},
		animation: false,
			scales: {
				xAxes: [{
				ticks: {
					autoSkip: true,
					maxTicksLimit: 13,
					callback: function(value, index, ticks) {
							return '+' + value + ' min';
						},
				},
				}],
			yAxes: [
		{
			id: 'B',
			type: 'linear',
			position: 'left',
			color: '#628bbd',
			ticks: {
			  max: 100,
			  min: 0,
			  maxTicksLimit: 5,
			  autoSkip: true,
			  callback: function(value, index, ticks) {
							return + String(Math.round(value)) + ' %';
						},
			}
		  }],
			},
	  }
	});
}
