use std::fs;

pub struct ToolsFramework;

impl ToolsFramework {
    pub fn read_file(file_path: &str) -> Result<String, String> {
        fs::read_to_string(file_path).map_err(|e| format!("خطأ أثناء قراءة الملف {}: {}", file_path, e))
    }

    pub fn write_file(file_path: &str, content: &str) -> Result<String, String> {
        fs::write(file_path, content).map_err(|e| format!("خطأ أثناء كتابة الملف {}: {}", file_path, e))?;
        Ok(format!("تمت كتابة الملف {} بنجاح.", file_path))
    }

    pub fn scan_current_workspace() -> Result<String, String> {
        let current_dir = std::env::current_dir().map_err(|e| e.to_string())?;
        let mut file_list = Vec::new();

        if let Ok(entries) = fs::read_dir(&current_dir) {
            for entry in entries.flatten() {
                if let Ok(name) = entry.file_name().into_string() {
                    let is_dir = entry.file_type().map(|t| t.is_dir()).unwrap_or(false);
                    file_list.push(format!("{} {}", if is_dir { "[مجلد]" } else { "[ملف]" }, name));
                }
            }
        }

        Ok(format!(
            "مسار المجلد الحالي: {}\nقائمة الملفات برمجياً:\n{}",
            current_dir.display(),
            file_list.join("\n")
        ))
    }
}
