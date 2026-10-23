use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

#[derive(Debug, Serialize, Deserialize)]
pub struct LicenseStatus {
    pub is_licensed: bool,
    pub hardware_id: String,
    pub license_key: Option<String>,
    pub tier: String,
}

pub fn get_hardware_id() -> String {
    let id = machine_uid::get().unwrap_or_else(|_| "GRIMOIRE-DEFAULT-HWID".to_string());
    let mut hasher = Sha256::new();
    hasher.update(id.as_bytes());
    let result = hasher.finalize();
    let hex_str: String = result[..6].iter().map(|b| format!("{:02X}", b)).collect();
    format!("HW-{}", hex_str)
}

pub fn verify_license_key(key: &str) -> bool {
    let trimmed = key.trim();
    trimmed.len() >= 8
}
