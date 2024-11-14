const fs = require('fs').promises;
const path = require('path');

class FileSystem {
  static async readFile(file) {
    const fullPath = path.isAbsolute(file) ? file : path.resolve(process.cwd(), file);

    try {
      await fs.stat(fullPath);
    } catch (e) {
      throw new Error(`Can not find file: ${fullPath}`);
    }

    try {
      const data = await fs.readFile(fullPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Can not read file data: ${fullPath}\n${error.message}`);
    }
  }
}

module.exports = FileSystem;