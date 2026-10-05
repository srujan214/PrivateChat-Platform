<div align="center">

# 💜 Private Space

### A cinematic, real-time chat app built for two people.
*Text · Images · Voice · Video — all in one place.*

<br>

[![Java](https://img.shields.io/badge/Java-25-ED8B00?style=flat-square&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1.1-6DB33F?style=flat-square&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-a855f7?style=flat-square)](LICENSE)

<br>

<img src="https://img.shields.io/badge/status-stable-brightgreen?style=for-the-badge" />
<img src="https://img.shields.io/badge/PRs-welcome-blueviolet?style=for-the-badge" />

</div>

---

## ✨ What is Private Space?

A **private chat app** designed for two people who want a space of their own — away from noise, ads, and surveillance.

**No ads. No tracking. No third-party servers.**
Just your messages, photos, and calls running on your own machine.

> Built for someone special. Made to feel personal.

---

## 🎬 Features

<table>
<tr>
<td width="50%">

### 💬 Communication
- **Real-time messaging** over WebSocket (STOMP)
- **Image & video sharing** with drag-drop
- **Voice calls** — peer-to-peer, no server hop
- **Video calls** — WebRTC with PiP layout
- **Typing indicator** — see them typing live
- **Read receipts** — double blue ticks
- **Online presence** — see when they're there

</td>
<td width="50%">

### 🎨 Experience
- **3D floating particles** background
- **Cinematic cursor** with magnetic rings
- **Aurora gradients** shifting in real time
- **Smooth animations** on every action
- **WhatsApp-style bubbles** for messages
- **Custom profiles** with avatar + bio
- **Fully mobile responsive**

</td>
</tr>
</table>

---

## 🚀 Quick Start

### 🐳 Prerequisites

Install **Docker Desktop** once → [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

### ⚡ One command

```bash
docker compose up -d
```

Then open 👉 **http://localhost80**

> ⏱ First run: **5–10 minutes** (downloads ~500 MB of dependencies).
> Every run after: **~20 seconds**.

<details>
<summary><b>🪟 Windows: double-click instead</b></summary>

<br>

Double-click **`start.bat`** in the project folder.

It will:
1. Check Docker is running
2. Build & start both containers
3. Auto-open your browser

</details>

<details>
<summary><b>👨‍💻 Dev mode (for coding)</b></summary>

<br>

Want hot-reload while you edit? Skip Docker:

**Terminal 1 — Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

</details>

---

## 🔌 Ports

| Service | URL | Notes |
|:--------|:----|:------|
| 🎨 **Frontend** | [http://localhost](http://localhost) | The app you open |
| ⚙️ **Backend API** | [http://localhost:8080](http://localhost:8080) | REST + WebSocket |
| 🗄️ **H2 Console** | [http://localhost:8080/h2-console](http://localhost:8080/h2-console) | Dev database viewer |

**H2 login credentials:**
```
JDBC URL:  jdbc:h2:file:./data/privatespace
User:      sa
Password:  (empty)
```

---

## 📱 Access from your phone

Mobile browsers **block camera/mic on plain HTTP** — they require HTTPS.

**Cloudflare Tunnel** gives you a free HTTPS URL in one command.

### Install (once)

```bash
winget install --id Cloudflare.cloudflared
```

Close & reopen PowerShell. Verify:
```bash
cloudflared --version
```

### Start the tunnel

With Docker running, open a **new terminal**:

```bash
cloudflared tunnel --url http://localhost80
```

You'll get:
```
https://random-words-here.trycloudflare.com
```

**Copy that URL → send to your phone → done. 💜**

> ⚠️ The URL changes every time you restart the tunnel.
> For a permanent URL, set up a [named Cloudflare tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/).

---

## 🛠️ Command Reference

<table>
<tr>
<td>

**Daily use**

```bash
docker compose up -d          # Start
docker compose down           # Stop
docker ps                     # Check status
```

</td>
<td>

**Debugging**

```bash
docker compose logs -f        # All logs
docker compose logs backend   # Backend only
docker compose logs frontend  # Frontend only
```

</td>
<td>

**Maintenance**

```bash
docker compose up -d --build  # Rebuild
docker compose restart        # Restart
docker compose down -v        # Wipe data
```

</td>
</tr>
</table>

---

## 📁 Project Structure

```
PrivateChat/
│
├── 📄 README.md                 ← you are here
├── 🚀 start.bat                 ← one-click launch (Windows)
├── 🐳 docker-compose.yml        ← orchestrates both services
├── 📜 LICENSE
├── 🙈 .gitignore
│
├── 📂 backend/                  ⚙️ Spring Boot API
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/srujan/privatespace/
│       ├── 🔐 auth/             JWT login & registration
│       ├── 👤 user/             Profile management
│       ├── 💬 chat/             Messaging + WebSocket handlers
│       ├── 📷 media/            Image/video upload
│       ├── 📞 webrtc/           Call signaling
│       └── ⚙️ config/            Security, CORS, WebSocket setup
│
└── 📂 frontend/                 🎨 React app
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    └── src/
        ├── 🖼️ pages/             Login · Chat · Profile
        ├── 🧩 components/        UI building blocks
        ├── 🪝 hooks/             WebSocket · WebRTC
        ├── 🌐 services/          API clients
        ├── 🔑 context/           Auth state
        └── 🎨 styles/            Tailwind + custom CSS
```

---

## 🧱 Tech Stack

<table>
<tr>
<th align="left">Layer</th>
<th align="left">Technology</th>
</tr>
<tr>
<td><b>Backend</b></td>
<td>

- ☕ **Java 25** — latest LTS-track JDK
- 🌱 **Spring Boot 4.1.1** — modern framework
- 🔌 **WebSocket (STOMP)** — real-time transport
- 🔐 **Spring Security + JWT** — stateless auth
- 🗄️ **H2 Database** — file-based, zero setup
- 📡 **WebRTC signaling** — peer discovery

</td>
</tr>
<tr>
<td><b>Frontend</b></td>
<td>

- ⚛️ **React 18** + **TypeScript**
- ⚡ **Vite** — lightning-fast build
- 🎨 **TailwindCSS** — utility-first styling
- 🎭 **Framer Motion** — animation library
- 🌌 **@react-three/fiber** — 3D WebGL scenes
- 📞 **simple-peer** — WebRTC wrapper

</td>
</tr>
<tr>
<td><b>Infrastructure</b></td>
<td>

- 🐳 **Docker** — containerization
- 🎼 **Docker Compose** — orchestration
- 🌐 **Nginx** — production serving
- ☁️ **Cloudflare Tunnel** — free HTTPS access

</td>
</tr>
</table>

---

## 🏗️ How it Works

```
   ┌──────────────┐                  ┌──────────────┐
   │              │                  │              │
   │   YOU        │◄─── WebRTC ────► │   THEM       │
   │              │   (P2P video)    │              │
   └───────┬──────┘                  └──────┬───────┘
           │                                 │
           │      ┌───────────────────┐     │
           └─────►│    WebSocket      │◄────┘
                  │   (text messages) │
                  └─────────┬─────────┘
                            │
                  ┌─────────▼─────────┐
                  │    Your Server    │
                  │  (Spring Boot)    │
                  │  ┌─────────────┐  │
                  │  │  H2 Database│  │
                  │  └─────────────┘  │
                  └───────────────────┘
```

**Video & audio never touch the server.** They go straight between you two.
Only text messages + signals go through the backend. 🔒

---

## ⚠️ Troubleshooting

<details>
<summary><b>🔴 Docker isn't running</b></summary>

<br>

Open **Docker Desktop** from the Start menu. Wait ~60 seconds for the 🐳 icon in your system tray to stop animating. Then retry.

</details>

<details>
<summary><b>🔴 Port already in use</b></summary>

<br>

Something else is using port 80 or 8080.

**Fix:** open `docker-compose.yml`, change:
```yaml
ports:
  - "80:80"    →   - "3000:80"
```

Then:
```bash
docker compose up -d
```
Visit `http://localhost:3000`.

</details>

<details>
<summary><b>🔴 White screen</b></summary>

<br>

Open browser DevTools (**F12 → Console**). Common causes:

- **Backend not running** → `docker compose logs backend`
- **Wrong API URL** → verify `frontend/src/services/api.ts` uses relative paths
- **CORS issue** → check backend `SecurityConfig`

</details>

<details>
<summary><b>🔴 Video call shows black screen</b></summary>

<br>

- ✅ Must be on **HTTPS** (Cloudflare Tunnel) or **localhost**
- ✅ Grant camera + mic permission when browser asks
- ✅ Both users must be online
- ✅ Check `[WebRTC]` logs in browser console

</details>

<details>
<summary><b>🔴 Camera/mic not working on phone</b></summary>

<br>

Mobile browsers block camera on plain HTTP. **You must use the Cloudflare HTTPS URL**, not the LAN IP.

</details>

<details>
<summary><b>🔴 Code changes don't appear</b></summary>

<br>

Docker serves a **built** version. Rebuild:
```bash
docker compose up -d --build
```

</details>

---

## 🔄 Updating

Pulled new code? Rebuild in one command:

```bash
docker compose down && docker compose up -d --build
```

Your data (messages, uploads, accounts) survives — it lives in Docker volumes.

---

## 🗑️ Reset Everything

Wipe database + uploads and start 100% fresh:

```bash
docker compose down -v
docker compose up -d --build
```

> ⚠️ **This deletes all messages and user accounts. Cannot be undone.**

---

## 🧪 System Requirements

<table>
<tr>
<th></th>
<th>Minimum</th>
<th>Recommended</th>
</tr>
<tr><td><b>OS</b></td><td>Win 10 · macOS 12 · Linux</td><td>Latest</td></tr>
<tr><td><b>RAM</b></td><td>4 GB</td><td>8 GB+</td></tr>
<tr><td><b>Disk</b></td><td>3 GB free</td><td>5 GB+</td></tr>
<tr><td><b>Docker</b></td><td>20.10+</td><td>Latest</td></tr>
<tr><td><b>Browser</b></td><td>Chrome 100 · Safari 15</td><td>Latest</td></tr>
</table>

---

## 🗺️ Roadmap

- [x] Text messaging
- [x] Image & video sharing
- [x] Video calls (WebRTC)
- [x] Voice calls
- [x] Profile editing
- [x] 3D backgrounds
- [ ] End-to-end encryption
- [ ] Message reactions
- [ ] Voice notes
- [ ] Group support (more than 2 people)
- [ ] Mobile app (React Native)
- [ ] Self-hosted deployment guide

---

## 🤝 Contributing

This is a personal project, but ideas are welcome.

1. Fork it
2. Create a feature branch (`git checkout -b feature/cool-thing`)
3. Commit your changes
4. Push and open a Pull Request

---

## 📜 License

**MIT** — free to use, modify, and share.

See [LICENSE](LICENSE) for full text.

---

<div align="center">

<br>

### 💜 Built with patience, frustration, and a lot of love.

*Made for two people who wanted a space of their own.*

<br>

**If this helped you build something for someone special — tell them.**

<br><br>

<sub>Made in India 🇮🇳 · Powered by coffee ☕ · Inspired by 💜</sub>

</div>
