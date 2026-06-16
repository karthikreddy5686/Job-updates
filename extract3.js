const fs = require('fs');
const lines = fs.readFileSync('C:\\Users\\home\\.gemini\\antigravity\\brain\\250e6c20-4707-4f3d-9166-41ee38490200\\.system_generated\\logs\\transcript.jsonl', 'utf8').split('\n');
let allUserContent = '';
for(let line of lines) {
  if (line.includes('"type":"USER_INPUT"')) {
    try {
      const obj = JSON.parse(line);
      if (obj.content && obj.content.includes('<USER_REQUEST>')) {
        allUserContent += '\n--- NEW REQUEST ---\n' + obj.content;
      }
    } catch(e) {}
  }
}
fs.writeFileSync('C:\\Job updates\\all_user_inputs.txt', allUserContent);
