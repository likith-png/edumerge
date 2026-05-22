import os
import glob

DS_NEW = """const DS = {
  primary: '#003f98',
  accent: '#fe9b01',
  bg: '#f8f9ff',
  cardBg: '#FFFFFF',
  border: '#e2e8f0',
  text: '#0f172a',
  textSecondary: '#64748b',
  critical: { text: '#dc2626', bg: '#fef2f2' },
  atRisk: { text: '#d97706', bg: '#fffbeb' },
  healthy: { text: '#475569', bg: '#f1f5f9' },
  neutral: { text: '#64748b', bg: '#f8fafc' },
  purple: { text: '#4f46e5', bg: '#eef2ff' },
  fontSans: '"DM Sans", sans-serif',
  fontMono: '"DM Mono", monospace',
};"""

def replace_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    import re
    content = re.sub(r'const DS = \{[\s\S]*?\n\};\n?', DS_NEW + '\n', content)

    with open(filepath, 'w') as f:
        f.write(content)
    print(f"Updated {filepath}")

files = glob.glob('/Users/likithv/Documents/DEMV3/client/src/pages/capacity-planner/*.tsx')
files.append('/Users/likithv/Documents/DEMV3/client/src/pages/CapacityPlanner.tsx')

for file in files:
    replace_in_file(file)
