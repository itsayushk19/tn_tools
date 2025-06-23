const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const sqlite3 = require("sqlite3").verbose();

// Path to markdown files
const toolsDir = path.join(__dirname, "../database/tools");

// Create or connect to SQLite DB
const db = new sqlite3.Database("tools.db");

// Step 1: Create table
db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS tools`);

  db.run(`
    CREATE TABLE tools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      title TEXT,
      description TEXT,
      date TEXT,
      category TEXT,
      tag TEXT
    )
  `);

  // Step 2: Read and process each .md file
  fs.readdirSync(toolsDir).forEach((file) => {
    if (file.endsWith(".md")) {
      const filePath = path.join(toolsDir, file);
      const content = fs.readFileSync(filePath, "utf-8");

      const { data } = matter(content);

      const name = path.basename(file, ".md");
      const title = data.title || "";
      const description = data.description || "";
      const date = data.date || "";
      const category = data.category || "";
      const tag = data.tag || "";

      db.run(
        `INSERT INTO tools (name, title, description, date, category, tag) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, title, description, date, category, tag],
        (err) => {
          if (err) {
            console.error(`Error inserting ${name}:`, err.message);
          } else {
            console.log(`Inserted: ${name}`);
          }
        }
      );
    }
  });
});
