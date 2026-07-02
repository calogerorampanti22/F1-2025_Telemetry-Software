# F1 2025 Telemetry Software & Dashboard

🌍 **Language Selection / Scelta della lingua:**
* [🇮🇹 Italiano](#-italiano)
* [🇬🇧 English](#-english)

---

## 🇮🇹 Italiano

### 🏁 Introduzione
Questo progetto è una soluzione completa per l'acquisizione e la visualizzazione dei dati telemetrici di **EA Sports F1® 25**. È composto da due componenti principali:
1. **Backend / Parser (C++)**: Un client UDP leggero e ad altissime prestazioni per ricevere e decodificare i pacchetti grezzi dal gioco.
2. **Frontend / Dashboard (React)**: Un'interfaccia utente moderna e reattiva che visualizza in tempo reale i dati essenziali, come l'indicatore delle marce, i tempi sul giro, la mappa del tracciato e la torre dei tempi (Timing Tower).

### 🚀 Funzionalità Principali
- **Parsing Binario Zero-Overhead:** Decodifica diretta in C++ tramite strutture `packed` senza allocazioni dinamiche inutili, assicurando latenza minima.
- **Architettura Multithreading:** Separazione ottimizzata tra il thread in ascolto UDP e il bridge/interfaccia per evitare la perdita di pacchetti.
- **Dashboard in Tempo Reale:** UI pulita ispirata alle grafiche televisive, che mostra distacchi, mescole di gomme, età delle gomme e penalità.
- **Pieno supporto a F1 25:** Costruito rispettando le specifiche ufficiali dei pacchetti UDP 2025 (Packet ID 0-15).

### 🛠️ Tecnologie e Librerie Esterne Utilizzate
Questo progetto si appoggia a standard industriali e moderne librerie open-source:
- **C++17** & **CMake**: Per la compilazione del core e del ricevitore UDP.
- **nlohmann/json**: Per una gestione moderna e rapida della serializzazione e deserializzazione dei dati in formato JSON.
- **Crow**: Microframework web in C++ veloce e leggero per la comunicazione tramite WebSocket con il frontend.
- **React 19** & **TypeScript**: Per garantire un'interfaccia utente solida, fortemente tipizzata e component-based.
- **Vite**: Come build tool e dev server estremamente rapido per il frontend.
- **Lucide-React**: Per l'inclusione di icone vettoriali moderne e leggere all'interno della dashboard.
- **ESLint**: Linter per mantenere alto lo standard qualitativo del codice sorgente.

### ⚙️ Installazione e Compilazione

#### 1. Compilazione del Parser C++
Assicurati di avere CMake installato. Apri il terminale nella root del progetto ed esegui:
```bash
mkdir build
cd build
cmake ..
cmake --build .
```
L'eseguibile verrà generato all'interno della cartella `build/` (o `build/Debug` / `build/Release` su Windows).

#### 2. Avvio della Dashboard (Frontend)
Assicurati di avere Node.js installato. Apri il terminale ed esegui:
```bash
cd f1-dashboard
npm install
npm run dev
```

### 🎮 Configurazione in F1 25
Per permettere all'app di ricevere i dati, abilita la telemetria nel gioco:
1. Vai su **Impostazioni > Impostazioni Telemetria**.
2. **Telemetria UDP**: Sì.
3. **Indirizzo IP**: `127.0.0.1` (o l'IP del dispositivo su cui è in esecuzione).
4. **Porta UDP**: `20777`.
5. **Formato UDP**: `2025`.
6. **Frequenza di Trasmissione**: Scegli una frequenza come 20Hz o 60Hz.

---

## 🇬🇧 English

### 🏁 Introduction
This project is a complete solution for capturing and visualizing telemetry data from **EA Sports F1® 25**. It consists of two main components:
1. **Backend / Parser (C++)**: A lightweight, high-performance UDP client that receives and decodes raw packets from the game.
2. **Frontend / Dashboard (React)**: A modern, reactive user interface that displays real-time essential data, such as gear indicators, lap times, a track progress map, and a timing tower.

### 🚀 Key Features
- **Zero-Overhead Binary Parsing:** Direct C++ decoding via `packed` structures with no unnecessary dynamic allocations, ensuring ultra-low latency.
- **Multithreaded Architecture:** Optimized separation between the UDP listening thread and the UI/bridge to prevent packet loss.
- **Real-Time Dashboard:** A clean UI inspired by TV broadcast graphics, displaying gaps, tyre compounds, tyre age, and penalties.
- **F1 25 Ready:** Fully compliant with the official 2025 UDP packet format specifications (Packet IDs 0-15).

### 🛠️ Technologies & External Libraries Used
This project relies on industry standards and modern open-source libraries:
- **C++17** & **CMake**: For compiling the core UDP receiver.
- **nlohmann/json**: For modern, fast, and seamless JSON data serialization and deserialization.
- **Crow**: A fast and lightweight C++ web microframework for WebSocket communication with the frontend.
- **React 19** & **TypeScript**: Providing a solid, strongly-typed, and component-based UI architecture.
- **Vite**: Used as an extremely fast frontend build tool and development server.
- **Lucide-React**: For including crisp, modern vector icons within the dashboard.
- **ESLint**: For keeping high source code quality standards.

### ⚙️ Installation & Build Instructions

#### 1. Building the C++ Parser
Make sure CMake is installed. Open a terminal in the root directory and run:
```bash
mkdir build
cd build
cmake ..
cmake --build .
```
The executable will be generated inside the `build/` folder (or `build/Debug` / `build/Release` on Windows).

#### 2. Starting the Dashboard (Frontend)
Ensure Node.js is installed. Open a terminal and run:
```bash
cd f1-dashboard
npm install
npm run dev
```

### 🎮 In-Game Configuration
To allow the application to receive data, enable telemetry in F1 25:
1. Go to **Settings > Telemetry Settings**.
2. **UDP Telemetry**: On.
3. **IP Address**: `127.0.0.1` (or the IP of your running device).
4. **UDP Port**: `20777`.
5. **UDP Format**: `2025`.
6. **Send Rate**: Choose a rate like 20Hz or 60Hz.

---

### ⚠️ Legal Disclaimer
This is an amateur, open-source, and unofficial project. It is in no way affiliated with, sponsored by, endorsed by, or associated with EA Sports, Electronic Arts Inc., Codemasters, or any Formula One group companies.

All information regarding the packet structures is derived from public documentation released on official EA forums for third-party developers. The trademarks "F1", "Formula 1", "FIA Formula One World Championship", and related logos are registered trademarks of Formula One Licensing BV and the Federation Internationale de l'Automobile (FIA). All rights belong to their respective owners.

### 📄 License
This project is licensed under the GNU GPL v3 License. See the LICENSE file in the root repository for more information.
