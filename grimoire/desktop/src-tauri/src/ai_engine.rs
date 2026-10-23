use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ModelSettings {
    pub execution_mode: String,
    pub local_model_name: String,
    pub low_resource_mode: bool,
    pub auto_summary: bool,
    pub model_path: Option<String>,
    pub server_url: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct ChatMessage {
    role: String,
    content: String,
}

#[derive(Serialize)]
struct ChatCompletionRequest {
    model: String,
    messages: Vec<ChatMessage>,
    temperature: f32,
}

#[derive(Deserialize)]
struct Choice {
    message: ChatMessage,
}

#[derive(Deserialize)]
struct ChatCompletionResponse {
    choices: Vec<Choice>,
}

pub struct QwenLocalEngine;

impl QwenLocalEngine {
    pub fn generate_response(prompt: &str, settings: &ModelSettings) -> Result<String, String> {
        let endpoint = settings
            .server_url
            .clone()
            .unwrap_or_else(|| "http://127.0.0.1:8080/v1/chat/completions".to_string());

        let system_prompt = "أنت Grimoire Agent - وكيل برمجي ذكي محلي متخصص في كتابة وتحليل الأكواد واللغة العربية.".to_string();

        let req_body = ChatCompletionRequest {
            model: "qwen2.5-7b".to_string(),
            messages: vec![
                ChatMessage {
                    role: "system".to_string(),
                    content: system_prompt,
                },
                ChatMessage {
                    role: "user".to_string(),
                    content: prompt.to_string(),
                },
            ],
            temperature: 0.7,
        };

        let client = reqwest::blocking::Client::builder()
            .timeout(std::time::Duration::from_secs(120))
            .build()
            .map_err(|e| e.to_string())?;

        // Attempt HTTP request to local server
        match client.post(&endpoint).json(&req_body).send() {
            Ok(res) if res.status().is_success() => {
                if let Ok(parsed) = res.json::<ChatCompletionResponse>() {
                    if let Some(choice) = parsed.choices.first() {
                        return Ok(choice.message.content.clone());
                    }
                }
            }
            _ => {
                // Also check Ollama port 11434
                let ollama_endpoint = "http://127.0.0.1:11434/v1/chat/completions";
                if let Ok(res) = client.post(ollama_endpoint).json(&req_body).send() {
                    if res.status().is_success() {
                        if let Ok(parsed) = res.json::<ChatCompletionResponse>() {
                            if let Some(choice) = parsed.choices.first() {
                                return Ok(choice.message.content.clone());
                            }
                        }
                    }
                }
            }
        }

        // Fallback info if local server is not started yet
        let path_info = settings
            .model_path
            .clone()
            .unwrap_or_else(|| "H:\\Qwen2.5-7B-Instruct-Q5_K_M.gguf".to_string());

        Ok(format!(
            "تم ربط نموذجك المحلي: `{}`\n\nلتشغيل الاستدلال الفعلي وإرجاع الردود من النموذج المباشر، يرجى تشغيل محرك `llama-server` أو `Ollama` بالموديل الخاص بك عبر الأمر التالي:\n\n```cmd\nllama-server.exe -m \"{}\" --port 8080 -c 4096\n```\n\nأو عبر Ollama:\n```cmd\nollama run qwen2.5:7b\n```\n\nبمجرد تشغيل السيرفر المحلي، سيرتبط Grimoire Agent تلقائياً ويقوم بالتوليد المباشر لك!",
            path_info, path_info
        ))
    }
}
