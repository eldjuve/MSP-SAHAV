# MSP-SAHAV  
**Marine Spatial Planning for Puducherry, India** [About](docs/Manual.docx)
![Marine Spatial Planning](img_msp.jpg)  

## Meets Digital Public Good Eligibility Criteria  
The **Puducherry Geo MSP portal** aligns with multiple **United Nations Sustainable Development Goals (SDGs)**, primarily:  

### 🌊 SDG 14 - Life Below Water  
- **Target 14.2**: Sustainably manage and protect marine and coastal ecosystems.  
- **Target 14.5**: Conserve at least 10% of coastal and marine areas.

### 🌍 SDG 13 - Climate Action  
- MSP enhances climate resilience by planning for coastal adaptation and mitigating sea-level rise impacts.  

### 🌱 SDG 15 - Life on Land  
- MSP integrates coastal zone management, protecting mangroves, seagrass, and wetlands.  

### 🏙️ SDG 11 - Sustainable Cities and Communities  
- Supports coastal urban planning, reducing the environmental impacts of coastal development.  

### 🏗️ SDG 9 - Industry, Innovation, and Infrastructure  
- Facilitates sustainable maritime infrastructure, including ports, offshore wind farms, and aquaculture.  

---

## About

This repository is a **Marine Spatial Planning web application** built with
**SolidJS**, **TypeScript**, and **Vite**, mapping data with **Leaflet** and
**ECharts**. Its navigation, map layers, legends, and charts are all
discovered from a **GeoServer** instance at runtime rather than hardcoded in
the frontend — see [Why This Rewrite](docs/rewrite-rationale.md) for the
reasoning, and [Data Formats](docs/Technical/data_formats.md) for exactly
what GeoServer needs to expose.

### **Features**
✔️ Interactive map with Google Satellite or ESRI imagery/topo base layers.
✔️ Navigation, layer groups, legends, and chart availability discovered from GeoServer's `GetCapabilities`/WFS, not hardcoded.
✔️ WMS and WFS layers from GeoServer, spanning multiple workspaces.
✔️ Chart panels (box plot, bar/line, scatter) rendered with ECharts, driven entirely by server-supplied data.
✔️ Typed end to end with TypeScript.
✔️ A local GeoServer + PostGIS demo stack (`webapp/demo-geoserver/`) for development without touching production.

---

## ✅ Prerequisites

To set up and work with this project, you'll need the following:

- [Node.js](https://nodejs.org/) (for running the Vite dev server and build).
- [GeoServer](https://geoserver.org/) installed and running — or use the bundled `webapp/demo-geoserver/` Docker Compose stack for local development.
  ➤ Refer to [GeoServer Setup & Hosting Guide](docs/installation/Backend/geoserver_setup_and_host_services.md)
- [QGIS](https://qgis.org/en/site/) for styling layers (optional).
  ➤ For styling vector/raster layers, see the [QGIS Styling Guide](https://docs.qgis.org/3.40/en/docs/user_manual/working_with_vector/vector_properties.html#symbology-properties)
- Basic knowledge of **TypeScript** and [SolidJS](https://www.solidjs.com/).
  ➤ See [Guide to Consuming GeoServer APIs](docs/installation/Frontend/consume_geoserver_apis.md)

---

## 📚 Documentation

Our project includes well-organized documentation, divided into technical and user-facing content:

### 🔧 Technical Documentation
- [Why This Rewrite](docs/rewrite-rationale.md)
- [Menu / Navigation Configuration](docs/Technical/menu_configuration.md)
- [GeoServer Data Formats](docs/Technical/data_formats.md)
- [Basemaps](docs/Technical/basemaps.md)

### 👤 User Documentation
- [Webpage User Guide](docs/User/Webpage_User_Doc.md)

For complete insights into the system setup, usage, and internal workings, explore the documents above.


## Installation

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/nccrmoes/MSP-SAHAV.git
cd MSP-SAHAV/webapp
```

### 2️⃣ Install dependencies
```sh
npm install
```

### 3️⃣ Point the app at a GeoServer instance
```sh
cp .env.example .env.local
```
Set `VITE_GEOSERVER_URL` in `.env.local` to your GeoServer's base URL (no
workspace, no `/wms`). To develop against a local instance seeded with real
demo data instead, see `webapp/demo-geoserver/README.md`.

### 4️⃣ Run the dev server
```sh
npm run dev
```
Open the local URL Vite prints (typically `http://localhost:5173`).

### 5️⃣ Build for production
```sh
npm run build
```

## Contributing
Feel free to fork this repository and contribute with improvements, fixes, or additional features.

## License
This project is open-source under the Apache 2.0 License.

## Support
For issues or questions, open a GitHub issue or contact us at `nccrmoeschennai@gmail.com`.