import json, re, os, datetime
root = '/data/workspace'
now = datetime.datetime.utcnow().replace(microsecond=0)
now_iso = now.isoformat()+'Z'
now_human = now.strftime('%Y-%m-%d %H:%M UTC')
# Update heartbeat-state.json
hs_path = os.path.join(root,'heartbeat-state.json')
with open(hs_path,'r') as f:
    hs = json.load(f)
# day rollover check
last_day = hs.get('counters',{}).get('lastDay')
this_day = now.strftime('%Y-%m-%d')
if last_day != this_day:
    hs.setdefault('counters',{})['runsToday'] = 0
hs['lastCronRun'] = now_iso
hs.setdefault('lastChecks',{})['heartbeat'] = now_iso
hs.setdefault('kpis',{})['microCommit'] = True
hs['kpis']['skillProgress'] = False
hs['kpis']['stateUpdated'] = True
c = hs.setdefault('counters',{})
c['runsToday'] = int(c.get('runsToday',0)) + 1
c['totalRuns'] = int(c.get('totalRuns',0)) + 1
c['lastDay'] = this_day
with open(hs_path,'w') as f:
    json.dump(hs,f,indent=2)
# Update counters.json
cnt_path = os.path.join(root,'counters.json')
try:
    with open(cnt_path,'r') as f:
        cnt = json.load(f)
except Exception:
    cnt = {}
cnt['runsToday'] = hs['counters']['runsToday']
cnt['totalRuns'] = hs['counters']['totalRuns']
cnt['lastRunUtc'] = now_iso
with open(cnt_path,'w') as f:
    json.dump(cnt,f,indent=2)
# Update STATUS.md
status_line = f"Status: {now_human} — KPIs: micro-commit=yes, skill-progress=no, state-updated=yes\n"
with open(os.path.join(root,'STATUS.md'),'w') as f:
    f.write(status_line)
# Append to logs/HEARTBEAT-LOG.md
log_path = os.path.join(root,'logs','HEARTBEAT-LOG.md')
entry = f"\n{now_iso} — DENKE quick-run — KPIs: micro-commit=yes, skill-progress=no, state-updated=yes\n\n- {now_human} — Micro-commit: cron: DENKE — synced heartbeat-state, counters, STATUS, README badges/time. KPIs: microCommit=yes, skillProgress=no, stateUpdated=yes.\n"
with open(log_path,'a') as f:
    f.write(entry)
# Update README.md badges and timestamps
readme_path = os.path.join(root,'README.md')
with open(readme_path,'r') as f:
    readme = f.read()
# Auto-updated comment
readme = re.sub(r'<!-- Auto-updated .*? -->', f'<!-- Auto-updated {now_iso} -->', readme)
# LastRun badge
readme = re.sub(r'last_run-\d{4}--\d{2}--\d{2}_\d{2}%3A\d{2}_UTC', f"last_run-{now.strftime('%Y--%m--%d_%H')}%3A{now.strftime('%M')}_UTC", readme)
# RunsToday badge
readme = re.sub(r'runs_today-\d+-blue', f"runs_today-{hs['counters']['runsToday']}-blue", readme)
# TotalRuns badge
readme = re.sub(r'total_runs-\d+-blue', f"total_runs-{hs['counters']['totalRuns']}-blue", readme)
# Letzter Lauf line
readme = re.sub(r'- Letzter Lauf: .*', f"- Letzter Lauf: {now_human} (cron: DENKE)", readme)
with open(readme_path,'w') as f:
    f.write(readme)
print('UPDATED', now_iso, hs['counters'])
