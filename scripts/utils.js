// Lightweight shared utilities for heartbeat scripts
// Keeps helpers in one place to avoid duplication across small scripts.

function pad(n) { return n < 10 ? '0' + n : '' + n; }

function getUtcNowDate() {
  const d = new Date();
  return new Date(Date.UTC(
    d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(),
    d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()
  ));
}

function isoNowUtc() {
  return getUtcNowDate().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function humanNowUtc() {
  const d = getUtcNowDate();
  const yyyy = d.getUTCFullYear();
  const mm = pad(d.getUTCMonth() + 1);
  const dd = pad(d.getUTCDate());
  const HH = pad(d.getUTCHours());
  const MM = pad(d.getUTCMinutes());
  const SS = pad(d.getUTCSeconds());
  return `${yyyy}-${mm}-${dd} ${HH}:${MM}:${SS} UTC`;
}

function dayStampUtc() {
  const d = getUtcNowDate();
  const yyyy = d.getUTCFullYear();
  const mm = pad(d.getUTCMonth() + 1);
  const dd = pad(d.getUTCDate());
  return `${yyyy}-${mm}-${dd}`;
}

function kpiFlags({ microCommit=false, skillProgress=false, stateUpdated=false }={}) {
  return `KPIs: Micro-Commit=${microCommit?'yes':'no'}, Skill-Fortschritt=${skillProgress?'yes':'no'}, State-Update=${stateUpdated?'yes':'no'}`;
}

module.exports = {
  getUtcNowDate,
  isoNowUtc,
  humanNowUtc,
  dayStampUtc,
  kpiFlags,
};
