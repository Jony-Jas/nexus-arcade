# 🎮 Nexus Arcade  
> Powered by Angular, Nx, Module Federation & Nest.js

A **modular gaming platform** where users can seamlessly **purchase** and **play games**!  
Built with a **microfrontend architecture** using **Webpack Module Federation**, Nexus Arcade dynamically loads third-party games into the platform. 🧩

✨ **Key Highlights**:
- 🔗 **Microfrontend magic** with Module Federation  
- 🕶️ **Style & DOM isolation** using Shadow DOM  
- 📡 **Custom event bus** for smooth communication between games and the main platform  

---

## 🚀 Getting Started

Clone and run the entire stack locally:

### 🧩 Frontend

```bash
git clone https://github.com/Jony-Jas/nexus-arcade
cd nexus-arcade
```
* Start proxy server 'nx serve reverse proxy`
* Start auth `nx serve auth`
* tart the main application (loads a sample game): `nx serve main --devRemotes=sample-game`

### 🔧 Backend

```bash
git clone https://github.com/Jony-Jas/nexus-arcade-backend
cd nexus-arcade-backend
```
* Start the backend `npm run start`

🎯 Open the App
visit: http://localhost:3000
