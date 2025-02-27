# Simplified Deployment Guide for cPanel

This guide will help you deploy your Vite React application to cPanel using Node.js.

## Pre-Deployment Steps

1. **Build your application locally**:
   ```bash
   npm run build
   ```
   This will create a `dist` folder with your production-ready files.

2. **Prepare your files for upload**:
   - The `dist` folder (contains your built application)
   - `server.cjs` (Express server to serve your application)
   - `test.cjs` (Simple test server to verify Node.js is working)
   - `package.json` (for dependencies)
   - `.htaccess` (for URL rewriting and caching)

## cPanel Configuration

1. **Log in to cPanel** and navigate to the **Setup Node.js App** section.

2. **Configure your Node.js application**:
   - **Node.js version**: Select the latest available version (14.x or higher recommended)
   - **Application mode**: Production
   - **Application root**: `/home4/webdaddy/yourappfolder` (adjust path as needed)
   - **Application URL**: Your domain or subdomain (e.g., webdaddy.sg)
   - **Application startup file**: `server.cjs` (or `test.cjs` for testing)
   - **Passenger log file**: `/home4/webdaddy/yourappname.log`

3. **Save your configuration** and note the application URL.

## File Upload

1. **Upload your files** to the application root directory you specified in cPanel:
   - Upload the contents of your local `dist` folder
   - Upload `server.cjs`, `test.cjs`, and `package.json`
   - Upload `.htaccess` to the root directory

2. **Install dependencies** using the cPanel Terminal or SSH:
   ```bash
   cd /home4/webdaddy/yourappfolder
   npm install express
   ```

## Final Steps

1. **Restart your Node.js application** from the cPanel interface.

2. **Test your application** by navigating to your application URL.

3. **Check the log file** if you encounter any issues:
   ```bash
   tail -f /home4/webdaddy/yourappname.log
   ```

## Troubleshooting

If your application is not working in cPanel, try these steps:

1. **Test with the test server first**:
   - In cPanel, set the Application startup file to `test.cjs`
   - Restart the application and visit your domain
   - If you see the test page, Node.js is working correctly

2. **Check file permissions**:
   ```bash
   chmod 755 server.cjs test.cjs
   chmod -R 755 dist
   ```

3. **Verify your dist folder**:
   - Make sure the `dist` folder is in the correct location (same directory as your server.cjs)
   - Check that `index.html` exists in the `dist` folder

4. **Check for errors in the log file**:
   ```bash
   tail -f /home4/webdaddy/yourappname.log
   ```

5. **Check Node.js version compatibility**:
   - Some hosting providers have limitations on Node.js versions
   - Try using an older Node.js version if the latest one doesn't work

## Maintenance

To update your application:
1. Build your application locally
2. Upload the new files to your server
3. Restart your Node.js application in cPanel
