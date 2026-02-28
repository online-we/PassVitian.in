# Switch from Netlify to Vercel (step-by-step)

Follow these steps in order to move **passvitian.in** from Netlify to Vercel.

---

## Step 1: Remove the custom domain from Netlify

1. In **Netlify**, go to your site → **Domain management** (left sidebar).
2. Find **passvitian.in** (Primary domain).
3. Click the **Options** dropdown (⋮) next to **passvitian.in**.
4. Click **Remove domain** (red text).
5. If **www.passvitian.in** is listed separately, remove it the same way (Options → Remove domain).
6. Confirm removal. Your site will still be reachable at **passvitian-in.netlify.app** until you disconnect the repo later.

---

## Step 2: Change nameservers back at Hostinger

Right now **passvitian.in** uses Netlify’s nameservers. To use the domain on Vercel, you can either use **Vercel’s nameservers** (recommended) or keep Hostinger DNS and only add records. This step is for **using Vercel’s nameservers** (you’ll get them in Step 4).

1. Log in to **Hostinger** → **Domains** → **DNS / Nameservers**.
2. Select **passvitian.in**.
3. Click **Change Nameservers**.
4. Choose **Hostinger nameservers** (e.g. `ns1.dns-parking.com` / `ns2.dns-parking.com`) and save.  
   - This stops using Netlify DNS. After Step 4 you’ll replace these with Vercel’s nameservers here.

*(If you prefer to keep Hostinger DNS, skip changing back now; in Step 4 you’ll add A/CNAME records at Hostinger instead of switching nameservers.)*

---

## Step 3: Deploy the project on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. **Continue with GitHub**).
2. Click **Add New…** → **Project**.
3. **Import** the **PassVitian** Git repository (GitHub/GitLab/Bitbucket).
4. Vercel will detect the app and use:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Root Directory:** (leave default)
5. **Environment variables** – add the same ones you used on Netlify:
   - `VITE_CLOUDINARY_CLOUD_NAME` = your Cloudinary cloud name  
   - `VITE_CLOUDINARY_UPLOAD_PRESET` = your unsigned preset name  
   - `CLOUDINARY_CLOUD_NAME` = same cloud name  
   - `CLOUDINARY_API_KEY` = from Cloudinary → API Keys  
   - `CLOUDINARY_API_SECRET` = from Cloudinary → API Keys  
   Add them for **Production** (and Preview if you want).
6. Click **Deploy**.
7. Wait for the build to finish. Your site will be live at something like **passvitian-in.vercel.app**.

---

## Step 4: Add passvitian.in on Vercel and set DNS

1. In the Vercel project, open **Settings** → **Domains** (or the **Domains** tab).
2. Click **Add** and enter **passvitian.in** → continue.
3. Vercel will show either:
   - **Nameservers** (e.g. `ns1.vercel-dns.com`, `ns2.vercel-dns.com`), or  
   - **A** and **CNAME** records to add at your registrar.

**Option A – Use Vercel’s nameservers (recommended)**

1. Copy the nameservers Vercel shows.
2. In **Hostinger** → **Domains** → **DNS / Nameservers** → **passvitian.in** → **Change Nameservers**.
3. Choose **Custom nameservers** and paste Vercel’s nameservers (all 2 or 4).
4. Save. Propagation can take from a few minutes up to 24–48 hours.

**Option B – Keep Hostinger DNS**

1. In Hostinger → **Manage DNS records** for **passvitian.in**.
2. Add or edit:
   - **A** record: Name **@**, Value = the IP Vercel gives (e.g. `76.76.21.21`).
   - **CNAME** record: Name **www**, Value = your Vercel hostname (e.g. `passvitian-in.vercel.app`).
3. Save.

4. Back in **Vercel** → Domains, click **Refresh** or wait; Vercel will verify and issue SSL.

---

## Step 5: Verify and optional cleanup

1. Open **https://passvitian.in** and **https://www.passvitian.in** and confirm the site and papers load.
2. **(Optional)** In Netlify, you can delete the site or disconnect the repo if you no longer need the Netlify deployment.

---

## Local development with the API

- The app calls **/api/list-papers** (Vercel serverless function).
- To run the app and API together locally, use:
  ```bash
  npx vercel dev
  ```
  Then open the URL it prints (e.g. `http://localhost:3000`). The API will be available at `/api/list-papers`.

---

## Quick checklist

- [ ] Removed **passvitian.in** and **www.passvitian.in** from Netlify Domain management  
- [ ] (If using Vercel nameservers) Set Hostinger nameservers back to Hostinger, then to Vercel’s after adding domain on Vercel  
- [ ] Created Vercel project from the PassVitian repo  
- [ ] Added all 5 env vars on Vercel  
- [ ] Deploy succeeded; site works on **\*.vercel.app**  
- [ ] Added **passvitian.in** (and **www** if required) in Vercel Domains  
- [ ] Updated DNS at Hostinger (nameservers or A + CNAME)  
- [ ] **https://passvitian.in** loads and papers work  
