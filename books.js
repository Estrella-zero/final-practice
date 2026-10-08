const books = [
  { type: '科技', total: 5000, place1: 2000, place2: 3000, lend: 3829 },
  { type: '历史', total: 8000, place1: 6000, place2: 2000, lend: 4657 },
  { type: '经济', total: 3500, place1: 2000, place2: 1500, lend: 2341 },
  { type: '艺术', total: 4000, place1: 3000, place2: 1000, lend: 3212 },
  { type: '外语', total: 6000, place1: 3500, place2: 2500, lend: 4125 },
  { type: '数学', total: 6000, place1: 2000, place2: 4000, lend: 1543 },
  { type: '农业', total: 5000, place1: 1500, place2: 3500, lend: 2431 }
];

const renderCards = () => {
  $('#cards').empty();
  books.forEach(b => {
    $('#cards').append(`
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title h6">${b.type}</h3>
            <p class="card-text fs-4">${b.total}<span class="fs-6 text-muted"> 册</span></p>
            <p class="card-text small text-muted">已借阅${b.lend}册</p>
          </div>
        </div>
      </div>
    `);
  });
};

let barChart = null;

const renderBarChart = () => {
  if (barChart === null) {
    barChart = echarts.init(document.querySelector('#bar-chart'));
  }
  barChart.setOption({
    title: { text: '各品类藏书与借阅量', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 60, right: 20, top: 50, bottom: 50 },
    xAxis: { type: 'category', data: books.map(b => b.type) },
    yAxis: { name: '册' },
    series: [
      { name: '总藏书', type: 'bar', data: books.map(b => b.total) },
      { name: '借阅量', type: 'bar', data: books.map(b => b.lend) }
    ]
  });
};

let pieChart = null;

const renderPieChart = () => {
  if (pieChart === null) {
    pieChart = echarts.init(document.querySelector('#pie-chart'));
  }
  let byType = {};
  books.forEach(b => {
    byType[b.type] = (byType[b.type] || 0) + b.lend;
  });
  pieChart.setOption({
    title: { text: '各品类借阅占比', left: 'center' },
    tooltip: { trigger: 'item', formatter: '{b}:{c}册({d}%)' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie',
      radius: '60%',
      data: Object.keys(byType).map(k => ({ name: k, value: byType[k] }))
    }]
  });
};

window.addEventListener('resize', () => {
  if (barChart) barChart.resize();
  if (pieChart) pieChart.resize();
});

$('#cards').on('click', '.card', function () {
  $(this).toggleClass('border-primary shadow');
});

renderCards();
renderPieChart();
renderBarChart();