git add .const fs = require('fs');
const inputFile = 'C:\\\\Users\\\\Dieu-Donné 😎\\\\.gemini\\\\antigravity\\\\brain\\\\86909313-1740-4cf6-a1d8-5dc79eb03c70\\\\.system_generated\\\\steps\\\\85\\\\output.txt';
const outputFile = 'C:\\\\Users\\\\Dieu-Donné 😎\\\\.gemini\\\\antigravity\\\\scratch\\\\luxtrax\\\\src\\\\integrations\\\\supabase\\\\types.ts';
const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
fs.writeFileSync(outputFile, data.types);
console.log('Types updated.');
