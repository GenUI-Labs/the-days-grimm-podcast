# Development Scripts

This folder contains convenience scripts for starting the development servers.

## Available Scripts

### `dev.bat` (Windows Batch)
A simple batch file that starts both frontend and backend servers simultaneously.
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

**Usage:**
```bash
scripts/dev.bat
```

### `dev.ps1` (PowerShell)
A PowerShell script with better formatting and job management for starting both servers.
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

**Usage:**
```powershell
scripts/dev.ps1
```

## Alternative Manual Start

If you prefer to start servers manually:

**Frontend:**
```bash
cd frontend
npm run dev
```

**Backend:**
```bash
cd backend
npm run dev
```

## Notes

- These scripts are optional and only for development convenience
- Make sure you have Node.js and npm installed
- Ensure you've run `npm install` in both `frontend/` and `backend/` directories
- The backend requires a `.env` file with your Printful API key (see `backend/env.example`)
