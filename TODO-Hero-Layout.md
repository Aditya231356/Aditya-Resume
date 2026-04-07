# Resume Hero/Contact Print Fix - BLACKBOXAI Plan

**Status: ✅ FIXED Print Contacts Missing**

## Completed Steps (Iteration 2)

### 1-3. ✅ Prior (Times New Roman, hero grid)

### 4. ✅ Bulletproof Print Contacts
   - Hero grid `1.2fr 1.1fr` + `min-height: 4cm`
   - `.contact-list li`: `flex !important; nowrap; 9pt !important; no grid-template !important`
   - Explicit: `display/block/visible/opacity/color/overflow/position` !important on contact elements
   - `.contact-card h2` compact

## Root Cause Fixed
- Print li **grid override** + narrow column → clipping/"invisible"
- Now: Strong flex, wider right, forced visibility → Text shows clearly top-right

**Verify**:
- Ctrl+P → Top: Left summary | Right contacts list (6 lines: Location...Portfolio)
- `export-pdf.bat` → Clean PDF with visible top-right contacts, Times New Roman

Layout professional, print-stable. No more missing contacts!
