use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandEvent;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            // Find and configure the sidecar specified in tauri.conf.json
            let sidecar_command = app.shell().sidecar("f1_telemetry")
                .expect("Failed to setup sidecar f1_telemetry");
            
            // Spawn the sidecar process
            // Note: Tauri automatically kills the sidecar when the main app exits
            let (mut rx, _child) = sidecar_command.spawn()
                .expect("Failed to spawn f1_telemetry sidecar");

            // Optional: read output from the sidecar
            tauri::async_runtime::spawn(async move {
                while let Some(event) = rx.recv().await {
                    if let CommandEvent::Stdout(line) = event {
                        if let Ok(str_line) = String::from_utf8(line) {
                            println!("[C++ Backend] {}", str_line.trim());
                        }
                    }
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
