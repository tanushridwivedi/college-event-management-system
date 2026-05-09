// =====================
//  Data
// =====================
const catTag = {
  Tech: 'tag-tech',
  Cultural: 'tag-cult',
  Sports: 'tag-sport',
  Academic: 'tag-acad'
};

let filter = 'All';

let events = [
  { id: 1, name: 'Hackathon 2025',         cat: 'Tech',     date: '2025-05-15', time: '9:00 AM',  venue: 'CS Lab Block',            seats: 100, filled: 78,  desc: '24-hour coding challenge',                  org: 'ACM Student Chapter' },
  { id: 2, name: 'Cultural Night',          cat: 'Cultural', date: '2025-05-18', time: '6:00 PM',  venue: 'Open Air Theatre',         seats: 200, filled: 145, desc: 'Music, dance & drama showcase',              org: 'Cultural Committee' },
  { id: 3, name: 'Inter-College Cricket',   cat: 'Sports',   date: '2025-05-20', time: '8:00 AM',  venue: 'Sports Ground',            seats: 50,  filled: 22,  desc: 'T20 format tournament',                     org: 'Sports Club' },
  { id: 4, name: 'Tech Talk: AI Careers',   cat: 'Tech',     date: '2025-05-22', time: '3:00 PM',  venue: 'Seminar Hall A',           seats: 80,  filled: 70,  desc: 'Industry experts on AI opportunities',      org: 'Training & Placement' },
  { id: 5, name: 'Research Paper Workshop', cat: 'Academic', date: '2025-05-25', time: '10:00 AM', venue: 'Library Conference Room',  seats: 40,  filled: 18,  desc: 'How to write & publish your first paper',   org: 'Research Cell' },
  { id: 6, name: 'Photography Walk',        cat: 'Cultural', date: '2025-05-28', time: '7:00 AM',  venue: 'Campus Grounds',           seats: 30,  filled: 12,  desc: 'Capture the campus at dawn',                org: 'Photography Club' },
  { id: 7, name: 'Robotics Demo Day',       cat: 'Tech',     date: '2025-06-02', time: '2:00 PM',  venue: 'Innovation Hub',           seats: 60,  filled: 48,  desc: 'Student robotics project showcase',         org: 'Robotics Club' },
  { id: 8, name: 'Yoga & Wellness Camp',    cat: 'Sports',   date: '2025-06-05', time: '6:00 AM',  venue: 'Terrace Garden',           seats: 60,  filled: 20,  desc: 'Beginner-friendly yoga session',            org: 'Student Wellness' },
];

let registered = new Set([1, 4, 7]);

// =====================
//  Helpers
// =====================
function pct(e) {
  return Math.round((e.filled / e.seats) * 100);
}

function formatDate(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// =====================
//  Navigation
// =====================
function showPage(name, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  btn.classList.add('active');

  if (name === 'events')         renderEvents();
  if (name === 'registrations')  renderRegistrations();
  if (name === 'dashboard')      renderDash();
}

// =====================
//  Filters
// =====================
function setFilter(f, btn) {
  filter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderEvents();
}

// =====================
//  Event Card HTML
// =====================
function eventCard(e, container) {
  const isReg = registered.has(e.id);
  const p = pct(e);
  return `
    <div class="event-card">
      <span class="event-tag ${catTag[e.cat]}">${e.cat}</span>
      <div class="event-title">${e.name}</div>
      <div class="event-meta">
        <span><i class="ti ti-calendar"></i>${formatDate(e.date)} · ${e.time}</span>
        <span><i class="ti ti-map-pin"></i>${e.venue}</span>
        <span><i class="ti ti-building"></i>${e.org}</span>
      </div>
      <div class="event-footer">
        <div style="flex:1;margin-right:12px">
          <div class="progress-bar">
            <div class="progress-fill" style="width:${p}%"></div>
          </div>
          <div class="seats-text">${e.seats - e.filled} seats left of ${e.seats}</div>
        </div>
        <button class="reg-btn ${isReg ? 'registered' : ''}" onclick="toggleReg(${e.id}, '${container}')">
          ${isReg ? '✓ Registered' : 'Register'}
        </button>
      </div>
    </div>`;
}

// =====================
//  Render: Dashboard
// =====================
function renderDash() {
  document.getElementById('dash-events').innerHTML = events.slice(0, 4).map(e => eventCard(e, 'dash')).join('');
  document.getElementById('m-total').textContent = events.length;
  document.getElementById('m-reg').textContent = registered.size;
  document.getElementById('m-up').textContent = events.filter(e => !registered.has(e.id)).length;
}

// =====================
//  Render: Events
// =====================
function renderEvents() {
  const q = (document.getElementById('search-input').value || '').toLowerCase();
  const filtered = events.filter(e =>
    (filter === 'All' || e.cat === filter) &&
    e.name.toLowerCase().includes(q)
  );
  document.getElementById('all-events').innerHTML = filtered.length
    ? filtered.map(e => eventCard(e, 'all')).join('')
    : '<p style="color:#5f6368;font-size:13px;padding:20px">No events found.</p>';
}

// =====================
//  Render: Registrations
// =====================
function renderRegistrations() {
  const myEvents = events.filter(e => registered.has(e.id));
  const tbody = document.getElementById('reg-table');
  if (!myEvents.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="color:#9aa0a6;text-align:center;padding:28px">No registrations yet. Browse events to register!</td></tr>';
    return;
  }
  tbody.innerHTML = myEvents.map(e => `
    <tr>
      <td style="font-weight:600">${e.name}</td>
      <td><span class="event-tag ${catTag[e.cat]}" style="margin:0">${e.cat}</span></td>
      <td>${formatDate(e.date)}</td>
      <td>${e.venue}</td>
      <td><span class="status-badge status-confirmed">Confirmed</span></td>
      <td>
        <button class="reg-btn" style="font-size:11px;padding:4px 10px;color:#A32D2D;border-color:#F09595"
          onmouseover="this.style.background='#FCEBEB'" onmouseout="this.style.background=''"
          onclick="cancelReg(${e.id})">Cancel</button>
      </td>
    </tr>`).join('');
}

// =====================
//  Registration Logic
// =====================
function toggleReg(id, ctx) {
  if (registered.has(id)) {
    cancelReg(id, ctx);
    return;
  }
  registered.add(id);
  showToast('Registered successfully! 🎉');
  if (ctx === 'all') renderEvents();
  else renderDash();
}

function cancelReg(id) {
  if (!confirm('Cancel your registration for this event?')) return;
  registered.delete(id);
  showToast('Registration cancelled.');
  renderRegistrations();
  renderDash();
}

// =====================
//  Add Event
// =====================
function addEvent() {
  const name  = document.getElementById('f-name').value.trim();
  const cat   = document.getElementById('f-cat').value;
  const date  = document.getElementById('f-date').value;
  const time  = document.getElementById('f-time').value;
  const venue = document.getElementById('f-venue').value.trim();
  const seats = parseInt(document.getElementById('f-seats').value) || 0;
  const desc  = document.getElementById('f-desc').value.trim();
  const org   = document.getElementById('f-org').value.trim();

  if (!name || !date || !venue || !seats) {
    showToast('Please fill in all required fields.', 'err');
    return;
  }

  const formattedTime = time
    ? new Date('1970-01-01T' + time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    : 'TBD';

  events.push({
    id: Date.now(),
    name, cat, date,
    time: formattedTime,
    venue, seats,
    filled: 0,
    desc,
    org: org || 'Organizer'
  });

  showToast('Event created successfully!');

  // Reset form
  ['f-name', 'f-date', 'f-venue', 'f-seats', 'f-desc', 'f-org'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('f-time').value = '14:00';
  document.getElementById('m-total').textContent = events.length;
}

// =====================
//  Toast Notification
// =====================
function showToast(msg, type) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = type === 'err' ? '#A32D2D' : '#1D9E75';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// =====================
//  Init
// =====================
renderDash();
