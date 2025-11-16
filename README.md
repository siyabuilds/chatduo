# ChatDuo

A Next.js application that enables real-time chat synchronization across multiple devices. Watch your conversations update simultaneously on different browsers or devices!

## ⚠️ Important Warning

**DO NOT USE IN PRODUCTION!** This application uses aggressive polling to synchronize chat messages across devices. This implementation will result in:

- **Extremely high API call volumes** (requests every 2 seconds per active client)
- **Skyrocketing costs** if deployed to production
- **Rate limiting issues** with most hosting providers
- **Poor scalability** and server resource exhaustion

This is a **demonstration/development project only**. For production use, implement proper WebSocket connections, Server-Sent Events (SSE), or a real-time database solution instead.

## 🛠️ Tools & Technologies Used

- **[Next.js 16.0.1](https://nextjs.org/)** - React framework with App Router
- **[React 19.2.0](https://react.dev/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[SweetAlert2](https://sweetalert2.github.io/)** - Beautiful alert modals
- **[Vercel Analytics](https://vercel.com/analytics)** - Web analytics

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js) or **yarn**

## 🚀 Setup Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/siyabuilds/chatduo.git
   cd chatduo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open in your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 How to Use on Multiple Devices

### Option 1: Same Device, Multiple Browsers/Tabs

1. Open the application in your default browser
2. Start a new chat or join an existing one (use the chat ID from the URL)
3. Open the same URL in a different browser or incognito window
4. Type messages in one browser and watch them appear in the other in real-time!

### Option 2: Multiple Devices on the Same Network

1. Start the development server on your primary device
2. Find your local IP address:
   - **Linux/Mac**: Run `ip addr show` or `ifconfig` (look for 192.168.x.x)
   - **Windows**: Run `ipconfig` (look for IPv4 Address)
3. On your other devices, navigate to `http://YOUR_IP_ADDRESS:3000`
   - Example: `http://192.168.1.100:3000`
4. Open the same chat on both devices and watch the magic happen!

### Option 3: Using Ngrok for Remote Testing

1. Install [ngrok](https://ngrok.com/)
2. Start your dev server: `npm run dev`
3. In a new terminal: `ngrok http 3000`
4. Use the ngrok URL on any device anywhere in the world

## 🎮 Using the Application

1. **Start a new chat**: Click "Start New Chat" on the homepage
2. **Share the chat**: Copy the URL from your browser and share it with another device/browser
3. **Send messages**: Type your message and press Enter or click Send
4. **Real-time sync**: Messages appear instantly across all connected devices

## 🔧 Other Available Commands

```bash
# Build for production (but remember the warning above!)
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🏗️ Project Structure

```
chatduo/
├── app/
│   ├── api/chat/[chatId]/     # API routes for chat operations
│   ├── chat/[chatId]/         # Dynamic chat pages
│   ├── utils/                 # Utility functions (chatMap)
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Homepage
├── public/                     # Static assets
└── Configuration files
```

## ⚡ How It Works (Technical Overview)

ChatDuo uses an in-memory Map to store chat messages on the server. Each client polls the server every 2 seconds to check for new messages. This approach:

- ✅ Works without a database
- ✅ Simple to understand and implement
- ❌ Doesn't scale
- ❌ Loses data on server restart
- ❌ Creates excessive API calls
- ❌ Expensive in production environments

## 🤝 Contributing

This is a demonstration project. Feel free to fork and experiment, but please heed the production warning!

**Remember**: This is a learning/demo project. Never deploy this polling approach to production! 🚨
