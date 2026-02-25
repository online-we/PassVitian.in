# PassVitian

Previous semester papers for VIT Bhopal Campus – upload and browse mid-term (MTE) and term-end (TEE) papers. Static frontend with Cloudinary storage and a small Netlify function to list papers.

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router DOM, Lucide React
- **Storage:** Cloudinary (unsigned upload from browser)
- **Backend:** Netlify serverless function (lists papers via Cloudinary Admin API)
- **Deploy:** Netlify

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Cloudinary

1. Create a [Cloudinary](https://cloudinary.com) account.
2. In Dashboard → Settings → Upload:
   - Create an **unsigned** upload preset (e.g. `passvitian_unsigned`).
   - Allow resource types: **Image** and **Raw** (for PDFs).
3. Note your **Cloud name** and the **Upload preset** name.

### 3. Environment variables

Copy `.env.example` to `.env` and fill in:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

For **Netlify** (site env vars or UI):

- `CLOUDINARY_CLOUD_NAME` – same cloud name
- `CLOUDINARY_API_KEY` – from Cloudinary Dashboard → API Keys
- `CLOUDINARY_API_SECRET` – from same page

### 4. Hero image

Place your landing hero image at:

```
public/hero-card.png
```

If the file is missing, the app shows a placeholder message.

### 5. Run locally

```bash
npm run dev
```

To test the list-papers function locally, use Netlify CLI:

```bash
npm i -g netlify-cli
netlify dev
```

Then open the URL shown (e.g. http://localhost:8888). The dev server will proxy `/.netlify/functions/*` to the local function.

### 6. Build & deploy

```bash
npm run build
```

Deploy the `dist` folder to Netlify (drag-and-drop or Git). Set the env vars in Netlify dashboard (Site settings → Environment variables).

## Project structure

```
src/
  components/    Layout, Navbar, UploadModal
  context/       PapersContext (fetch papers, upload)
  pages/         Home, Papers, SubjectPapers
  services/      cloudinary.js (upload), api.js (fetch papers)
netlify/functions/
  list-papers.js   Serverless function to list Cloudinary resources
```

## Routes

- `/` – Landing (hero + View Papers)
- `/papers` – All subjects (search + grid), “Upload Papers” at top
- `/papers/:subjectCode` – Papers for one subject, “Upload Papers” at top (pre-filled subject)
