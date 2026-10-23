pub mod ai_engine;
pub mod licensing;
pub mod memory_db;
pub mod tools;

use ai_engine::{ModelSettings, QwenLocalEngine};
use licensing::{get_hardware_id, verify_license_key, LicenseStatus};
use memory_db::{MemoryDatabase, MemoryRecord, MessageRecord};
use tools::ToolsFramework;

#[tauri::command]
fn generate_response(prompt: String, settings: ModelSettings) -> Result<String, String> {
    QwenLocalEngine::generate_response(&prompt, &settings)
}

#[tauri::command]
fn get_history() -> Result<Vec<MessageRecord>, String> {
    let conn = MemoryDatabase::init_db().map_err(|e| e.to_string())?;
    MemoryDatabase::get_messages(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
fn save_message(message: MessageRecord) -> Result<(), String> {
    let conn = MemoryDatabase::init_db().map_err(|e| e.to_string())?;
    MemoryDatabase::save_message(&conn, &message).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_memories() -> Result<Vec<MemoryRecord>, String> {
    let conn = MemoryDatabase::init_db().map_err(|e| e.to_string())?;
    MemoryDatabase::get_memories(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
fn scan_workspace() -> Result<String, String> {
    ToolsFramework::scan_current_workspace()
}

#[tauri::command]
fn check_license() -> LicenseStatus {
    LicenseStatus {
        is_licensed: true,
        hardware_id: get_hardware_id(),
        license_key: Some("GRIMOIRE-LIFETIME-PRO".to_string()),
        tier: "pro_lifetime".to_string(),
    }
}

#[tauri::command]
fn verify_license(license_key: String) -> bool {
    verify_license_key(&license_key)
}

#[tauri::command]
fn clear_memory() -> Result<(), String> {
    let conn = MemoryDatabase::init_db().map_err(|e| e.to_string())?;
    MemoryDatabase::clear_all(&conn).map_err(|e| e.to_string())
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            generate_response,
            get_history,
            save_message,
            get_memories,
            scan_workspace,
            check_license,
            verify_license,
            clear_memory
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
