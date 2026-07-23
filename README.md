# Everyday Unit Converter

A responsive web app for converting common units of distance, temperature, and weight.

**Live website:** [Open the Everyday Unit Converter](https://ambitious-desert-0f50ad410.7.azurestaticapps.net)

## Features

- Miles and kilometers
- Celsius, Fahrenheit, and Kelvin
- Pounds and kilograms
- Automatic conversion while typing
- Swap conversion direction
- Responsive layout for computers, tablets, and phones
- Offline support after the first visit
- Browser cache updates that check for the newest deployed version

## Technologies

- HTML
- CSS
- JavaScript
- Azure Static Web Apps
- GitHub Actions

All conversion calculations run locally in the user's browser. The app does not collect, transmit, or store entered values.

## Project Files

- `index.html` — page content and controls
- `styles.css` — layout and visual design
- `app.js` — conversion calculations and interactions
- `service-worker.js` — offline support and browser caching
- `manifest.webmanifest` — installable web-app information
- `staticwebapp.config.json` — Azure routing and cache configuration

## Run Locally

### NetBeans

1. Open the project as an HTML5/JavaScript application with existing sources.
2. Set `index.html` as the start file.
3. Use the Embedded Lightweight web server.
4. Run the project in Firefox, Edge, or Chrome.

### Visual Studio Code

1. Open the project folder.
2. Install the Live Server extension.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

## Deployment

The project uses this deployment flow:

```text
Local project → GitHub → GitHub Actions → Azure Static Web Apps
```

When changes are committed to the `main` branch, GitHub Actions automatically deploys the updated files to Azure.

## Author

Created by Carlos Barriosnuevo.
