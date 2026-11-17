const fs = require('fs');

const path = 'c:/Users/uk/Pictures/flash4-3/app/components/CheckoutFlowModal.js';
let content = fs.readFileSync(path, 'utf8');
const isCRLF = content.includes('\r\n');
if (isCRLF) {
  content = content.replace(/\r\n/g, '\n');
}

const oldBlock = `      // 1. Write to PrimaryDB (flash-213bd) - Both 'discount' and 'discounts' collections
      if (Firestore) {
        try {
          // A. 'discount' (singular)
          const primaryParentDoc = doc(Firestore, 'discount', safeShopDocId);
          await setDoc(primaryParentDoc, { shopName: rawShopName, lastUpdated: serverTimestamp() }, { merge: true }).catch(() => {});

          const primaryDiscountDoc = doc(Firestore, 'discount', safeShopDocId, 'online', dateStr);
          await setDoc(primaryDiscountDoc, dailySummaryPayload, { merge: true }).catch(err =>
            console.warn('[Discount] PrimaryDB discount collection notice:', err?.message)
          );

          // B. 'discounts' (plural) - for direct visibility in Firebase Console as requested
          const primaryParentDiscountsDoc = doc(Firestore, 'discounts', safeShopDocId);
          await setDoc(primaryParentDiscountsDoc, { shopName: rawShopName, lastUpdated: serverTimestamp() }, { merge: true }).catch(() => {});

          const primaryDiscountsDoc = doc(Firestore, 'discounts', safeShopDocId, 'online', dateStr);
          await setDoc(primaryDiscountsDoc, dailySummaryPayload, { merge: true }).catch(err =>
            console.warn('[Discount] PrimaryDB discounts collection notice:', err?.message)
          );

          // C. Flat top-level doc under 'discounts' collection for immediate root-level inspection
          if (finalFlashId) {
            const rootOrderDoc = doc(Firestore, 'discounts', \`FlashId-\${finalFlashId}\`);
            await setDoc(rootOrderDoc, flatOrderRecord, { merge: true }).catch(err =>
              console.warn('[Discount] PrimaryDB discounts flat root doc notice:', err?.message)
            );
          }

          console.log(\`[Discount] ✅ Successfully recorded in PrimaryDB (discount + discounts) for \${rawShopName}\`);
        } catch (pErr) {
          console.warn('[Discount] PrimaryDB write error:', pErr?.message);
        }
      }

      // 2. Write to SharedDB (flashshared project)
      if (SharedDB) {
        try {
          // A. 'discount' (singular)
          const sharedParentDoc = doc(SharedDB, 'discount', safeShopDocId);
          await setDoc(sharedParentDoc, { shopName: rawShopName, lastUpdated: serverTimestamp() }, { merge: true }).catch(() => {});

          const sharedDiscountDoc = doc(SharedDB, 'discount', safeShopDocId, 'online', dateStr);
          await setDoc(sharedDiscountDoc, dailySummaryPayload, { merge: true });

          // B. 'discounts' (plural)
          const sharedParentDiscountsDoc = doc(SharedDB, 'discounts', safeShopDocId);
          await setDoc(sharedParentDiscountsDoc, { shopName: rawShopName, lastUpdated: serverTimestamp() }, { merge: true }).catch(() => {});

          const sharedDiscountsDoc = doc(SharedDB, 'discounts', safeShopDocId, 'online', dateStr);
          await setDoc(sharedDiscountsDoc, dailySummaryPayload, { merge: true });

          if (finalFlashId) {
            await setDoc(doc(SharedDB, 'discounts', \`FlashId-\${finalFlashId}\`), flatOrderRecord, { merge: true }).catch(() => {});
          }

          console.log(\`[Discount] ✅ Successfully recorded in SharedDB for \${rawShopName}\`);
        } catch (sErr) {
          console.warn('[Discount] SharedDB write notice:', sErr?.message);
        }
      }

      // 3. Write to VendorDB (flashpartner-4157e)
      if (VendorDB) {
        try {
          const vendorParentDoc = doc(VendorDB, 'discount', safeShopDocId);
          await setDoc(vendorParentDoc, { shopName: rawShopName, lastUpdated: serverTimestamp() }, { merge: true }).catch(() => {});

          const vendorDiscountDoc = doc(VendorDB, 'discount', safeShopDocId, 'online', dateStr);
          await setDoc(vendorDiscountDoc, dailySummaryPayload, { merge: true }).catch(() => {});

          const vendorParentDiscountsDoc = doc(VendorDB, 'discounts', safeShopDocId);
          await setDoc(vendorParentDiscountsDoc, { shopName: rawShopName, lastUpdated: serverTimestamp() }, { merge: true }).catch(() => {});

          const vendorDiscountsDoc = doc(VendorDB, 'discounts', safeShopDocId, 'online', dateStr);
          await setDoc(vendorDiscountsDoc, dailySummaryPayload, { merge: true }).catch(() => {});

          if (finalFlashId) {
            await setDoc(doc(VendorDB, 'discounts', \`FlashId-\${finalFlashId}\`), flatOrderRecord, { merge: true }).catch(() => {});
          }

          console.log(\`[Discount] ✅ Successfully recorded in VendorDB for \${rawShopName}\`);
        } catch (vErr) {
          console.warn('[Discount] VendorDB write notice:', vErr?.message);
        }`;

const newBlock = `      // 1. Write to PrimaryDB (flash-213bd) - Strictly canonical 'discount' collection
      if (Firestore) {
        try {
          const primaryParentDoc = doc(Firestore, 'discount', safeShopDocId);
          await setDoc(primaryParentDoc, { shopName: rawShopName, lastUpdated: serverTimestamp() }, { merge: true }).catch(() => {});

          const primaryDiscountDoc = doc(Firestore, 'discount', safeShopDocId, 'online', dateStr);
          await setDoc(primaryDiscountDoc, dailySummaryPayload, { merge: true }).catch(err =>
            console.warn('[Discount] PrimaryDB discount collection notice:', err?.message)
          );

          console.log(\`[Discount] ✅ Successfully recorded in PrimaryDB discount collection for \${rawShopName}\`);
        } catch (pErr) {
          console.warn('[Discount] PrimaryDB write error:', pErr?.message);
        }
      }

      // 2. Write to SharedDB (flashshared project) - Strictly canonical 'discount' collection
      if (SharedDB) {
        try {
          const sharedParentDoc = doc(SharedDB, 'discount', safeShopDocId);
          await setDoc(sharedParentDoc, { shopName: rawShopName, lastUpdated: serverTimestamp() }, { merge: true }).catch(() => {});

          const sharedDiscountDoc = doc(SharedDB, 'discount', safeShopDocId, 'online', dateStr);
          await setDoc(sharedDiscountDoc, dailySummaryPayload, { merge: true });

          console.log(\`[Discount] ✅ Successfully recorded in SharedDB discount collection for \${rawShopName}\`);
        } catch (sErr) {
          console.warn('[Discount] SharedDB write notice:', sErr?.message);
        }
      }

      // 3. Write to VendorDB (flashpartner-4157e) - Strictly canonical 'discount' collection
      if (VendorDB) {
        try {
          const vendorParentDoc = doc(VendorDB, 'discount', safeShopDocId);
          await setDoc(vendorParentDoc, { shopName: rawShopName, lastUpdated: serverTimestamp() }, { merge: true }).catch(() => {});

          const vendorDiscountDoc = doc(VendorDB, 'discount', safeShopDocId, 'online', dateStr);
          await setDoc(vendorDiscountDoc, dailySummaryPayload, { merge: true }).catch(() => {});

          console.log(\`[Discount] ✅ Successfully recorded in VendorDB discount collection for \${rawShopName}\`);
        } catch (vErr) {
          console.warn('[Discount] VendorDB write notice:', vErr?.message);
        }`;

if (content.includes(oldBlock)) {
  content = content.replace(oldBlock, newBlock);
  console.log('Successfully eliminated redundant discounts writes in CheckoutFlowModal.js');
} else {
  console.log('Error: oldBlock not found');
}

if (isCRLF) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(path, content, 'utf8');
console.log('Saved CheckoutFlowModal.js');
