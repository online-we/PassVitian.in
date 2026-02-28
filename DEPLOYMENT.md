# PassVitian – Go Live Checklist

Follow these steps in order so students can find the site on Google and upload/view papers.

---

## Step 1: Set up Cloudinary

1. **Create an account**  
   Go to [cloudinary.com](https://cloudinary.com) and sign up (free tier is enough).

2. **Note your Cloud name**  
   In the Dashboard, you’ll see **Cloud name** (e.g. `dxxxxxx`). Copy it.

3. **Create unsigned upload preset(s)**  
   - Dashboard → **Settings** (gear) → **Upload** tab  
   - Scroll to **Upload presets** → **Add upload preset**  
   - **Preset name:** e.g. `PassVitian` or `passvitian_image`  
   - **Signing Mode:** **Unsigned**  
   - **Asset folder:** e.g. `papers`  
   - **Resource type:** If you see a dropdown (Image / Video / Raw / Auto), choose **Image** for this preset. Save.  
   - For **PDFs**, either the same preset may work when using the raw upload API, or you need a second preset: **Add upload preset** again, same settings but **Resource type** → **Raw**, name e.g. `passvitian_raw`. Save.  
   - In Netlify, set `VITE_CLOUDINARY_UPLOAD_PRESET` to your image preset name. If you created a separate raw preset, also set `VITE_CLOUDINARY_UPLOAD_PRESET_RAW` to that name.

4. **Get API credentials (for Netlify only)**  
   Dashboard → **Settings** → **API Keys**  
   Copy **API Key** and **API Secret**. You’ll add these only in Netlify, not in your code.

5. **Allow PDF delivery (required for papers to open)**  
   Dashboard → **Settings** → **Security**  
   Under **PDF and ZIP files delivery**, check **Allow delivery of PDF and ZIP files**.  
   Click **Save**. Without this, PDFs upload but won’t open when students click “GET PDF”.

---

## Step 2: Put the project in Git (if you haven’t)

From your project folder:

```bash
cd c:\Users\firoj\Downloads\PassVitian
git init
git add .
git commit -m "Initial PassVitian app"
```

Create a new repository on **GitHub** (e.g. `yourusername/passvitian`), then:

```bash
git remote add origin https://github.com/yourusername/passvitian.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy on Netlify

1. **Sign in**  
   Go to [netlify.com](https://www.netlify.com) and log in (use “Sign up with GitHub” if you use GitHub).

2. **Create a new site**  
   - **Add new site** → **Import an existing project**  
   - Choose **GitHub** and authorize Netlify  
   - Select the **PassVitian** repo  
   - Netlify will read `netlify.toml` and use:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
     - **Functions directory:** `netlify/functions`

3. **Add environment variables** (before first deploy)  
   In the Netlify site → **Site configuration** → **Environment variables** → **Add a variable** / **Import from .env**:

   | Variable name | Value | Notes |
   |---------------|--------|--------|
   | `VITE_CLOUDINARY_CLOUD_NAME` | Your Cloudinary **cloud name** | Used by the frontend |
   | `VITE_CLOUDINARY_UPLOAD_PRESET` | Your **unsigned preset** name (e.g. `passvitian_unsigned`) | Used by the frontend |
   | `CLOUDINARY_CLOUD_NAME` | Same cloud name | Used by the serverless function |
   | `CLOUDINARY_API_KEY` | From Cloudinary → API Keys | Used by the function only |
   | `CLOUDINARY_API_SECRET` | From Cloudinary → API Keys | Used by the function only |

   Add them for **All scopes** (or at least Production).

   **If the build fails with "Secrets scanning detected secrets":** In Netlify, do **not** mark `VITE_CLOUDINARY_CLOUD_NAME` or `VITE_CLOUDINARY_UPLOAD_PRESET` as "Contains secret values" — they are public by design (client uploads). Only mark `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` as secret. The repo’s `netlify.toml` already sets `SECRETS_SCAN_OMIT_KEYS` so those two are excluded from scanning.

   Then trigger a new deploy: **Deploys** → **Trigger deploy** → **Deploy site**.

4. **Wait for the build**  
   When the deploy succeeds, you get a URL like `https://random-name-123.netlify.app`. Test:
   - Open the URL → you should see the landing page.
   - Go to **Papers** → **Upload Papers** → choose a PDF/image, fill subject code/name/paper name, click **Done** → the paper should upload and appear in the list.

---

## Step 4: (Optional) Connect a custom domain

### Connecting passvitian.in (Hostinger) to Netlify

**Part A – In Netlify**

1. Go to your site → **Domain management** (left sidebar).
2. Under **Add your existing custom domain**, type **`passvitian.in`** in **Custom domain or subdomain**.
3. Click **Verify**.
4. Netlify will either:
   - **Option 1 – Recommend nameservers:** It will show 4 nameservers (e.g. `dns1.p01.nsone.net`, `dns2.p01.nsone.net`, …). Use **Part B1** below.
   - **Option 2 – Recommend DNS records:** It will show an **A** record and a **CNAME** for `www`. Use **Part B2** below.

**Part B1 – Use Netlify nameservers (recommended)**

1. In **Hostinger**: Domains → **DNS / Nameservers** → select **passvitian.in**.
2. Click **Change Nameservers**.
3. Choose **Custom nameservers** and replace the current ones with the **exact** nameservers Netlify gave you (e.g. `dns1.p01.nsone.net`, `dns2.p01.nsone.net`, etc.). Add all 4 if Netlify shows 4.
4. Save. DNS can take from a few minutes up to 24–48 hours to propagate.
5. Back in **Netlify** → Domain management, click **Verify DNS configuration** (or wait for Netlify to detect it). Add **www.passvitian.in** as well if Netlify suggests it.

**Part B2 – Keep Hostinger DNS (A + CNAME records)**

1. In **Netlify**, note the values it shows, for example:
   - **A** record: **Name** `@`, **Value** `75.2.60.5` (Netlify’s load balancer; your value may differ).
   - **CNAME** record: **Name** `www`, **Value** `your-site-name.netlify.app`.
2. In **Hostinger**: Domains → **DNS / Nameservers** → **Manage DNS records** for **passvitian.in**.
3. **Root domain (@):**
   - Edit the existing **A** record for **Name** `@` and set **Points to** to the IP Netlify gave you (e.g. `75.2.60.5`).  
   - Or delete the current A record and **Add New Record**: Type **A**, Name **@**, Points to **&lt;Netlify IP&gt;**, TTL 14400 (or default).
4. **www:**
   - Edit the existing **CNAME** for **Name** `www` and set **Content** to your Netlify hostname (e.g. `passvitian-in.netlify.app`).  
   - Or delete the old CNAME and **Add New Record**: Type **CNAME**, Name **www**, Content **&lt;your-site&gt;.netlify.app**, TTL 14400.
5. Save. Wait a few minutes (up to 24–48 hours for full propagation).
6. In **Netlify** → Domain management, click **Verify DNS configuration**. Add **www.passvitian.in** if Netlify asks for it.

**Part C – HTTPS**

- After DNS verifies, Netlify will issue an SSL certificate for **passvitian.in** and **www.passvitian.in**.
- Open **https://passvitian.in** and **https://www.passvitian.in** to confirm.

---

*Generic steps (other registrars):*

1. **Add domain in Netlify**  
   Site → **Domain management** → **Add custom domain** (e.g. `passvitian.com` or `papers.yourdomain.com`).

2. **Configure DNS**  
   At your domain registrar (GoDaddy, Namecheap, etc.):
   - For a **subdomain** (e.g. `papers.vitbhopal.ac.in`): add a **CNAME** record: `papers` → `random-name-123.netlify.app` (your Netlify URL).
   - For **root domain** (e.g. `passvitian.com`): Netlify will show the **A** and **CNAME** records to add; follow the instructions.

3. **HTTPS**  
   Netlify will issue an SSL certificate automatically. Wait a few minutes, then open your domain with `https://`.

---

## Step 5: Help Google (and students) find the site

1. **Good title and description**  
   The project already has a clear `<title>` and meta description in `index.html`. If you use a custom domain, the same tags will help Google show a nice snippet in search.

2. **Submit to Google Search Console**  
   - Go to [Google Search Console](https://search.google.com/search-console)  
   - Add a **property** with your live URL (e.g. `https://passvitian.netlify.app` or your custom domain)  
   - Verify ownership (e.g. HTML file or DNS record as suggested by Google)  
   - Submit the sitemap: `https://your-site-url.netlify.app/sitemap.xml` (optional; see below)

3. **Optional: sitemap**  
   For a small site, Google will still discover pages from the homepage and links. If you want a sitemap later, you can add a static `public/sitemap.xml` with your main URLs.

4. **Share the link**  
   Share the live URL on WhatsApp groups, college forums, or social media so students can start using it and linking to it. More visits and links help search engines notice the site.

---

## Quick checklist

- [ ] Cloudinary account + cloud name noted  
- [ ] Unsigned upload preset created (Image + Raw)  
- [ ] **Security → Allow delivery of PDF and ZIP files** checked  
- [ ] API Key & Secret copied (for Netlify only)  
- [ ] Repo on GitHub and pushed  
- [ ] Netlify site created from that repo  
- [ ] All 5 env vars set in Netlify  
- [ ] Deploy succeeded; site opens in browser  
- [ ] Upload test: one paper uploaded and visible  
- [ ] (Optional) Custom domain added and DNS set  
- [ ] (Optional) Search Console property added and verified  

Once Step 3 is done and upload works, the project is live and usable. Domain and Google steps make it easier for students to find it on search.
