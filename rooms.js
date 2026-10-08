const state = { rooms: [] };
let currentFilter = 'all';
let barChart = null;
let pieChart = null;
let byBuilding = {};

const list = document.querySelector('#room-list');
const filterFloor = document.querySelector('#filter-floor');
const statusFilters = document.querySelector('#status-filters');
const statusTip = document.querySelector('#status');

const loadData = async () => {
  statusTip.textContent = '加载中...';
  statusTip.classList.remove('d-none');
  try {
    const res = await fetch('/api/rooms');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (!data.rooms || data.rooms.length === 0) {
      statusTip.textContent = '暂无自习室数据';
      return;
    }
    state.rooms = data.rooms;
    statusTip.classList.add('d-none');
    renderPieChart();
    renderBarChart();
    render();
  } catch (err) {
    statusTip.textContent = '加载失败：' + err.message + '（请通过HTTP服务器访问）';
  }
};

const render = () => {
  list.innerHTML = '';
  const floor = filterFloor.value;
  const shown = state.rooms.filter(r => {
    const matchFloor = floor === '' || r.floor === Number(floor);
    let matchFilter;
    if (currentFilter === 'all') matchFilter = true;
    else if (currentFilter === 'open') matchFilter = r.status === '开放';
    else if (currentFilter === 'free') matchFilter = (r.seats - r.occupied) > 0;
    return matchFloor && matchFilter;
  });

  if (shown.length === 0) {
    const li = document.createElement('li');
    li.textContent = '没有符合条件的自习室';
    list.appendChild(li);
    renderCards([]);
    return;
  }
  shown.forEach(r => {
    const li = document.createElement('li');
    li.textContent = `${r.name}  ${r.building}${r.floor}楼  ${r.status}  剩余${r.seats - r.occupied}座`;
    list.appendChild(li);
  });
  renderCards(shown);
};

const renderCards = (data) => {
  $('#cards').empty();
  data.forEach(r => {
    const free = r.seats - r.occupied;
    $('#cards').append(`
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title h6">${r.name}</h3>
            <p class="card-text fs-4">${r.occupied}<span class="fs-6 text-muted"> / ${r.seats} 座</span></p>
            <p class="card-text small text-muted">剩余${free}座</p>
          </div>
        </div>
      </div>
    `);
  });
};

const renderBarChart = () => {
  if (barChart === null) {
    barChart = echarts.init(document.querySelector('#bar-chart'));
    barChart.on('click', function (params) {
      if (params.componentType !== 'series') return;
      var room = state.rooms.find(r => r.name === params.name);
      if (!room) return;
      var idx = Object.keys(byBuilding).indexOf(room.building);
      pieChart.dispatchAction({ type: 'downplay', seriesIndex: 0 });
      pieChart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: idx });
    });
  }
  barChart.setOption({
    title: { text: '各自习室座位使用情况', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { bottom: 90 },
    xAxis: {
      type: 'category',
      data: state.rooms.map(r => r.name),
      axisLabel: { rotate: 40, fontSize: 10 }
    },
    yAxis: { name: '座' },
    series: [
      { name: '总座位', type: 'bar', data: state.rooms.map(r => r.seats) },
      { name: '已占用', type: 'bar', data: state.rooms.map(r => r.occupied) }
    ]
  });
};

const renderPieChart = () => {
  if (pieChart === null) {
    pieChart = echarts.init(document.querySelector('#pie-chart'));
  }
  byBuilding = {};
  state.rooms.forEach(r => {
    byBuilding[r.building] = (byBuilding[r.building] || 0) + r.seats;
  });
  pieChart.setOption({
    title: { text: '各楼馆座位占比', left: 'center' },
    tooltip: { trigger: 'item', formatter: '{b}:{c}座({d}%)' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie',
      radius: '60%',
      data: Object.keys(byBuilding).map(k => ({ name: k, value: byBuilding[k] }))
    }]
  });
};

filterFloor.addEventListener('change', render);
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

loadData();