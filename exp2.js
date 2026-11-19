const fs = require('fs/promises');
const path = require('path');

const filePath = path.join(__dirname, 'notes.txt');

async function runCrudDemo() {
  // 1. CREATE: Write a new file (fails if it already exists via 'wx' flag)
  await fs.writeFile(filePath, 'First line of notes.\n', { encoding: 'utf8', flag: 'wx' });
  console.log('Created file:', filePath);

  // 2. READ: Read file contents and metadata
  const initialContent = await fs.readFile(filePath, 'utf8');
  const stats = await fs.stat(filePath);
  console.log('Initial content:', initialContent.trim());
  console.log('Size in bytes:', stats.size);

  // 3. UPDATE: Append new content (or overwrite with writeFile)
  await fs.appendFile(filePath, 'Second line appended.\n', 'utf8');
  const updatedContent = await fs.readFile(filePath, 'utf8');
  console.log('Updated content:', updatedContent.trim());

  // 4. DELETE: Remove the file
  await fs.unlink(filePath);
  console.log('Deleted file:', filePath);
}

runCrudDemo().catch((err) => {
  console.error('File operation failed:', err.code || err.message);
});