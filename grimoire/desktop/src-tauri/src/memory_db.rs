use rusqlite::{params, Connection, Result};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct MessageRecord {
    pub id: String,
    pub role: String,
    pub content: String,
    pub timestamp: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MemoryRecord {
    pub id: String,
    pub key: String,
    pub summary: String,
    pub content: String,
    pub category: String,
    pub timestamp: String,
}

pub struct MemoryDatabase;

impl MemoryDatabase {
    pub fn init_db() -> Result<Connection> {
        let conn = Connection::open("grimoire_memory.db")?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS messages (
                id TEXT PRIMARY KEY,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                timestamp TEXT NOT NULL
            )",
            [],
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS memories (
                id TEXT PRIMARY KEY,
                key TEXT NOT NULL,
                summary TEXT NOT NULL,
                content TEXT NOT NULL,
                category TEXT NOT NULL,
                timestamp TEXT NOT NULL
            )",
            [],
        )?;

        Ok(conn)
    }

    pub fn save_message(conn: &Connection, msg: &MessageRecord) -> Result<()> {
        conn.execute(
            "INSERT OR REPLACE INTO messages (id, role, content, timestamp) VALUES (?1, ?2, ?3, ?4)",
            params![msg.id, msg.role, msg.content, msg.timestamp],
        )?;
        Ok(())
    }

    pub fn get_messages(conn: &Connection) -> Result<Vec<MessageRecord>> {
        let mut stmt = conn.prepare("SELECT id, role, content, timestamp FROM messages ORDER BY timestamp ASC")?;
        let rows = stmt.query_map([], |row| {
            Ok(MessageRecord {
                id: row.get(0)?,
                role: row.get(1)?,
                content: row.get(2)?,
                timestamp: row.get(3)?,
            })
        })?;

        let mut msgs = Vec::new();
        for r in rows {
            msgs.push(r?);
        }
        Ok(msgs)
    }

    pub fn get_memories(conn: &Connection) -> Result<Vec<MemoryRecord>> {
        let mut stmt = conn.prepare("SELECT id, key, summary, content, category, timestamp FROM memories ORDER BY timestamp DESC")?;
        let rows = stmt.query_map([], |row| {
            Ok(MemoryRecord {
                id: row.get(0)?,
                key: row.get(1)?,
                summary: row.get(2)?,
                content: row.get(3)?,
                category: row.get(4)?,
                timestamp: row.get(5)?,
            })
        })?;

        let mut mems = Vec::new();
        for r in rows {
            mems.push(r?);
        }
        Ok(mems)
    }

    pub fn clear_all(conn: &Connection) -> Result<()> {
        conn.execute("DELETE FROM messages", [])?;
        conn.execute("DELETE FROM memories", [])?;
        Ok(())
    }
}
