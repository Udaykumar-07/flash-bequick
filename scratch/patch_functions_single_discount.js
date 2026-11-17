const fs = require('fs');

const path = 'c:/Users/uk/Pictures/flash-partner3/functions/index.js';
let content = fs.readFileSync(path, 'utf8');
const isCRLF = content.includes('\r\n');
if (isCRLF) {
  content = content.replace(/\r\n/g, '\n');
}

const oldFunctionsBlock = `    // 1. Write to SharedDB (flashshared project) using Service Account
    try {
        const sharedDb = getSharedDb();
        if (sharedDb) {
            // A. 'discount' (singular)
            await sharedDb.collection('discount').doc(safeShopName).set({
                shopName: rawShopName,
                lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            }, { merge: true });

            const sharedDiscountDocRef = sharedDb.collection('discount').doc(safeShopName).collection('online').doc(finalDateStr);
            await sharedDiscountDocRef.set(payload, { merge: true });

            // B. 'discounts' (plural)
            await sharedDb.collection('discounts').doc(safeShopName).set({
                shopName: rawShopName,
                lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            }, { merge: true });

            const sharedDiscountsDocRef = sharedDb.collection('discounts').doc(safeShopName).collection('online').doc(finalDateStr);
            await sharedDiscountsDocRef.set(payload, { merge: true });

            if (flashId || paymentId) {
                await sharedDb.collection('discounts').doc(\`FlashId-\${flashId || paymentId}\`).set({
                    ...orderEntry,
                    shopName: rawShopName,
                    date: finalDateStr,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                }, { merge: true });
            }

            console.log(\`[Discount] ✅ Successfully recorded discount in SharedDB (discount + discounts) for \${safeShopName} on \${finalDateStr}\`);
        }
    } catch (sharedErr) {
        console.error('[Discount] Failed recording discount in SharedDB:', sharedErr.message);
    }

    // 2. Also write to VendorDB for vendor dashboard visibility
    try {
        // A. 'discount' (singular)
        await db.collection('discount').doc(safeShopName).set({
            shopName: rawShopName,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        const vendorDiscountDocRef = db.collection('discount').doc(safeShopName).collection('online').doc(finalDateStr);
        await vendorDiscountDocRef.set(payload, { merge: true });

        // B. 'discounts' (plural)
        await db.collection('discounts').doc(safeShopName).set({
            shopName: rawShopName,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        const vendorDiscountsDocRef = db.collection('discounts').doc(safeShopName).collection('online').doc(finalDateStr);
        await vendorDiscountsDocRef.set(payload, { merge: true });

        if (flashId || paymentId) {
            await db.collection('discounts').doc(\`FlashId-\${flashId || paymentId}\`).set({
                ...orderEntry,
                shopName: rawShopName,
                date: finalDateStr,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            }, { merge: true });
        }

        console.log(\`[Discount] ✅ Successfully recorded discount in VendorDB (discount + discounts) for \${safeShopName} on \${finalDateStr}\`);
    } catch (vErr) {
        console.warn('[Discount] Failed recording discount in VendorDB:', vErr.message);
    }`;

const newFunctionsBlock = `    // 1. Write to SharedDB (flashshared project) using Service Account - Canonical 'discount' collection
    try {
        const sharedDb = getSharedDb();
        if (sharedDb) {
            await sharedDb.collection('discount').doc(safeShopName).set({
                shopName: rawShopName,
                lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            }, { merge: true });

            const sharedDiscountDocRef = sharedDb.collection('discount').doc(safeShopName).collection('online').doc(finalDateStr);
            await sharedDiscountDocRef.set(payload, { merge: true });

            console.log(\`[Discount] ✅ Successfully recorded discount in SharedDB discount collection for \${safeShopName} on \${finalDateStr}\`);
        }
    } catch (sharedErr) {
        console.error('[Discount] Failed recording discount in SharedDB:', sharedErr.message);
    }

    // 2. Also write to VendorDB for vendor dashboard visibility - Canonical 'discount' collection
    try {
        await db.collection('discount').doc(safeShopName).set({
            shopName: rawShopName,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        const vendorDiscountDocRef = db.collection('discount').doc(safeShopName).collection('online').doc(finalDateStr);
        await vendorDiscountDocRef.set(payload, { merge: true });

        console.log(\`[Discount] ✅ Successfully recorded discount in VendorDB discount collection for \${safeShopName} on \${finalDateStr}\`);
    } catch (vErr) {
        console.warn('[Discount] Failed recording discount in VendorDB:', vErr.message);
    }`;

if (content.includes(oldFunctionsBlock)) {
  content = content.replace(oldFunctionsBlock, newFunctionsBlock);
  console.log('Successfully eliminated redundant discounts writes in functions/index.js');
} else {
  console.log('Error: oldFunctionsBlock not found');
}

if (isCRLF) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(path, content, 'utf8');
console.log('Saved functions/index.js');
