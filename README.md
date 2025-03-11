# WASM File Converter (Rust + Vite/React)

This project is a **WebAssembly-based file converter** that allows users to upload images and convert them between formats (PNG, JPG, etc.).  
It consists of:  
- **Backend**: A Rust WebAssembly (WASM) module for file processing.  
- **Frontend**: A Vite-powered React app in TypeScript.  

## Features
- Upload images via the frontend.  
- Convert images between multiple formats using the Rust backend.  
- Fast performance due to Rust’s efficiency and WebAssembly execution.  
- Modern UI built with React and Vite.  

## Setup Instructions

### 1. Clone the Repository
```sh
git clone https://github.com/johnt0/file_converter.git
cd file_converter
```
### 2. Install Dependencies
```sh
npm install --prefix client
```

### 3. Run the application
```sh
npm run dev --prefix client
```