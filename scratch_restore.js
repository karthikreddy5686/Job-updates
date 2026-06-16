const fs = require('fs');
const path = require('path');

const logPath = 'C:/Users/home/.gemini/antigravity/brain/250e6c20-4707-4f3d-9166-41ee38490200/.system_generated/logs/transcript.jsonl';
const targetPath = 'C:/Job updates/app/job-updates/tracker/page.tsx';

try {
  const fileContent = fs.readFileSync(logPath, 'utf8');
  const lines = fileContent.split('\n');
  let targetStep = null;
  
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line);
      if (parsed.step_index === 995) {
        targetStep = parsed;
        break;
      }
    } catch (e) {}
  }
  
  if (!targetStep) {
    console.error('Step 995 not found in log.');
    process.exit(1);
  }
  
  const content = targetStep.content;
  console.log('Found content, length:', content.length);
  
  // Extract lines from content
  const contentLines = content.split('\n');
  const cleanLines = [];
  
  let started = false;
  for (let cl of contentLines) {
    if (cl.startsWith('1: \'use client\';') || cl.startsWith('1: \'use client\'')) {
      started = true;
    }
    if (started) {
      // Remove line number prefix (e.g. "123: ")
      const match = cl.match(/^\d+:\s?(.*)$/);
      if (match) {
        cleanLines.push(match[1]);
      } else {
        // Fallback for lines without line number prefixes
        cleanLines.push(cl);
      }
    }
  }
  
  const cleanContent = cleanLines.join('\n');
  fs.writeFileSync(targetPath, cleanContent, 'utf8');
  // Copy to frontend duplicate page too to keep them in sync
  fs.writeFileSync('C:/Job updates/frontend/app/job-updates/tracker/page.tsx', cleanContent, 'utf8');
  console.log('Successfully restored tracker page!');
} catch (e) {
  console.error(e);
}
