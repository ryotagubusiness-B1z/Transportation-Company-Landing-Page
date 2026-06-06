const jobs = [
  {
    title: 'ルート配送ドライバー',
    body: '決まった納品先へ食品・日用品を届ける日勤中心の配送職です。',
    time: '7:30-16:30',
    condition: '普通免許相談可',
  },
  {
    title: '中型トラックドライバー',
    body: '店舗・センター間の配送を担当します。免許取得支援でステップアップできます。',
    time: 'シフト制',
    condition: '中型免許歓迎',
  },
  {
    title: '運行管理サポート',
    body: '配車表、点呼、納品状況の確認を行う内勤職です。',
    time: '8:30-17:30',
    condition: 'PC入力',
  },
];

const dayPlan = [
  ['07:30', '点呼・車両確認', '健康状態、配送ルート、車両点検を確認します。'],
  ['08:15', '積み込み', '納品順に荷物を整理し、数量を確認します。'],
  ['09:00', '配送開始', '決まったエリアの店舗・拠点へ配送します。'],
  ['15:30', '帰庫・報告', '伝票、車両状態、翌日の注意点を共有します。'],
  ['16:30', '退勤', '翌日の予定を確認して終了します。'],
];

const perks = [
  ['免許取得支援', '職種に必要な免許取得を支援します。'],
  ['安全研修', '横乗り研修と点検手順を学べます。'],
  ['制服・備品貸与', '勤務に必要な用品を用意します。'],
  ['希望休相談', '事前の休み相談ができる運用です。'],
];

const STORE_KEY = 'rrl_applications_v1';
const $ = (selector) => document.querySelector(selector);

const html = (value) =>
  String(value ?? '').replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  }[char]));

function readApplications() {
  return JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
}

function writeApplications(items) {
  localStorage.setItem(STORE_KEY, JSON.stringify(items));
}

function renderJobs() {
  $('#jobsRoot').innerHTML = jobs.map((job) => `
    <article class="card">
      <div>
        <h3>${job.title}</h3>
        <p>${job.body}</p>
      </div>
      <div class="meta">
        <span>${job.time}</span>
        <span>${job.condition}</span>
      </div>
    </article>
  `).join('');

  const options = jobs.map((job) => `<option>${job.title}</option>`).join('');
  $('#roleSelect').insertAdjacentHTML('beforeend', `${options}<option>相談したい</option>`);
}

function renderDayPlan() {
  $('#flowRoot').innerHTML = dayPlan.map(([time, title, body]) => `
    <article>
      <span class="time">${time}</span>
      <h3>${title}</h3>
      <p>${body}</p>
    </article>
  `).join('');
}

function renderPerks() {
  $('#benefitsRoot').innerHTML = perks.map(([title, body]) => `
    <article class="benefit">
      <h3>${title}</h3>
      <p>${body}</p>
    </article>
  `).join('');
}

function renderApplications() {
  const rows = readApplications();
  $('#applicationCount').textContent = `${rows.length}件の応募`;

  if (!rows.length) {
    $('#applicationsBody').innerHTML = '<tr><td colspan="6" class="empty">まだ応募は保存されていません。</td></tr>';
    return;
  }

  $('#applicationsBody').innerHTML = rows.map((item) => `
    <tr>
      <td>${item.id}</td>
      <td>${html(item.name)}</td>
      <td>${html(item.role)}</td>
      <td>${html(item.tel)}</td>
      <td>${html(item.start)}</td>
      <td>${item.createdAt}</td>
    </tr>
  `).join('');
}

function makeCsv(items) {
  const headers = ['id', 'name', 'tel', 'email', 'role', 'start', 'license', 'message', 'createdAt'];
  const rows = items.map((item) =>
    headers.map((key) => `"${String(item[key] ?? '').replaceAll('"', '""')}"`).join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

function downloadCsv() {
  const rows = readApplications();

  if (!rows.length) {
    $('#status').textContent = 'CSV出力する応募がありません。';
    return;
  }

  const blob = new Blob([makeCsv(rows)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = 'applications.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function saveApplication(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form));
  const application = {
    id: `APP-${Date.now().toString().slice(-6)}`,
    ...data,
    createdAt: new Date().toLocaleString('ja-JP'),
  };

  writeApplications([application, ...readApplications()]);
  renderApplications();

  $('#status').textContent = `${application.name}さん、${application.role}の応募を保存しました。`;
  form.reset();
  location.hash = 'applications';
}

function clearApplications() {
  if (!confirm('保存された応募をすべて削除しますか？')) return;

  writeApplications([]);
  renderApplications();
  $('#status').textContent = '応募データを削除しました。';
}

document.addEventListener('DOMContentLoaded', () => {
  renderJobs();
  renderDayPlan();
  renderPerks();
  renderApplications();

  $('#applyForm').addEventListener('submit', saveApplication);
  $('#exportCsv').addEventListener('click', downloadCsv);
  $('#clearApplications').addEventListener('click', clearApplications);
});
