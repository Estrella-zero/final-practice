const singers = [
  { name:'陈粒-奇妙能力歌', decade:2010, status:'独立', plays:850,  likes:620,  singer:'陈粒' },
  { name:'陈粒-易燃易爆炸', decade:2010, status:'民谣', plays:1200, likes:880,  singer:'陈粒' },
  { name:'陈粒-小半',       decade:2010, status:'流行', plays:2100, likes:1500, singer:'陈粒' },
  { name:'周杰伦-晴天',     decade:2000, status:'流行', plays:9800, likes:7200, singer:'周杰伦' },
  { name:'周杰伦-七里香',   decade:2000, status:'流行', plays:8600, likes:6500, singer:'周杰伦' },
  { name:'周杰伦-稻香',     decade:2000, status:'民谣', plays:7400, likes:5800, singer:'周杰伦' },
  { name:'林俊杰-江南',     decade:2000, status:'流行', plays:6800, likes:5200, singer:'林俊杰' },
  { name:'林俊杰-可惜没如果',decade:2010, status:'流行', plays:4200, likes:3500, singer:'林俊杰' },
  { name:'邓紫棋-光年之外',  decade:2010, status:'流行', plays:5600, likes:4100, singer:'邓紫棋' },
  { name:'邓紫棋-泡沫',      decade:2010, status:'流行', plays:4900, likes:3800, singer:'邓紫棋' }
];

let currentFilter = 'all';

const list = document.querySelector('#singer-list');
const filterDecade = document.querySelector('#filter-decade');
const statusFilters = document.querySelector('#status-filters');

const render = () => {
  list.innerHTML = '';
  const decade = filterDecade.value;

  const shown = singers.filter(r => {
    const matchDecade = decade === '' || r.decade === Number(decade);
    let matchFilter;
    if (currentFilter === 'all') {
      matchFilter = true;
    } else if (currentFilter === 'pop') {
      matchFilter = r.status === '流行';
    } else if (currentFilter === 'folk') {
      matchFilter = r.status === '民谣';
    }
    return matchDecade && matchFilter;
  });

  if (shown.length === 0) {
    const li = document.createElement('li');
    li.textContent = '没有符合条件的歌曲';
    list.appendChild(li);
    renderCards([]);
    return;
  }

  shown.forEach(song => {
    const li = document.createElement('li');
    li.textContent = `${song.name}  ${song.status}  收藏${song.likes}万`;
    list.appendChild(li);
  });

  renderCards(shown);
};

const renderCards = (data) => {
  $('#cards').empty();
  data.forEach(r => {
    const remain = r.plays - r.likes;
    $('#cards').append(`
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title h6">${r.name}</h3>
            <p class="card-text fs-4">${r.likes}<span class="fs-6 text-muted"> / ${r.plays} 万播放</span></p>
            <p class="card-text small text-muted">未收藏${remain}万次</p>
          </div>
        </div>
      </div>
    `);
  });
};

let barChart = null;
let bySinger = {};

const renderBarChart = () => {
  if (barChart === null) {
    barChart = echarts.init(document.querySelector('#bar-chart'));

    barChart.on('click', function (params) {
      if (params.componentType !== 'series') return;
      var song = singers.find(function (r) {
        return r.name === params.name;
      });
      if (!song) return;
      var idx = Object.keys(bySinger).indexOf(song.singer);
      pieChart.dispatchAction({ type: 'downplay', seriesIndex: 0 });
      pieChart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: idx });
    });
  }
  barChart.setOption({
    title: { text: '各歌曲播放与收藏量', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { bottom: 90 },
    xAxis: {
      type: 'category',
      data: singers.map(r => r.name),
      axisLabel: { rotate: 40, fontSize: 10 }
    },
    yAxis: { name: '万次' },
    series: [
      { name: '播放量', type: 'bar', data: singers.map(r => r.plays) },
      { name: '收藏量', type: 'bar', data: singers.map(r => r.likes) }
    ]
  });
};

let pieChart = null;

const renderPieChart = () => {
  if (pieChart === null) {
    pieChart = echarts.init(document.querySelector('#pie-chart'));
  }
  bySinger = {};
  singers.forEach(r => {
    bySinger[r.singer] = (bySinger[r.singer] || 0) + r.plays;
  });
  pieChart.setOption({
    title: { text: '各歌手播放量占比', left: 'center' },
    tooltip: { trigger: 'item', formatter: '{b}:{c}万({d}%)' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie',
      radius: '60%',
      data: Object.keys(bySinger).map(k => ({ name: k, value: bySinger[k] }))
    }]
  });
};

filterDecade.addEventListener('change', render);
statusFilters.addEventListener('click', e => {
  if (e.target.tagName !== 'BUTTON') return;
  currentFilter = e.target.dataset.filter;
  render();
});

window.addEventListener('resize', () => {
  if (barChart) barChart.resize();
  if (pieChart) pieChart.resize();
});

$('#cards').on('click', '.card', function () {
  $(this).toggleClass('border-primary shadow');
});

renderPieChart();
renderBarChart();
render();