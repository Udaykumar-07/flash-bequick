const fs = require('fs');

const path = 'c:/Users/uk/Pictures/flash4-3/app/(tabs)/Dashboard.js';
let content = fs.readFileSync(path, 'utf8');
const isCRLF = content.includes('\r\n');
if (isCRLF) {
  content = content.replace(/\r\n/g, '\n');
}

const target = `            // Fast parallel vendor checks using Promise.all
            restaurants = await Promise.all(foodDocs.map(async (docSnap) => {
              const data = docSnap.data();
              const lat = data.location?.latitude ?? data.location?._latitude ?? null;
              const lng = data.location?.longitude ?? data.location?._longitude ?? null;
              const address = data.address || data.location?.address || (typeof data.location === 'string' ? data.location : '');
              const image = data.shopImage || data.image || null;
              const isPureVeg = data.isPureVeg === true || data.isPureVeg === 'true' || data.pureVeg === true || data.isVeg === true;
              const cuisine = data.cuisine || data.category || '';
              const rating = typeof data.rating === 'number' ? data.rating : (parseFloat(data.rating) || 4.5);
              const prepTime = typeof data.prepTime === 'number' ? data.prepTime : (parseInt(data.prepTime, 10) || 5);

              let isShopActive = data.isActive !== false && data.isActive !== 'false';
              let isShopOpen = data.isOpen !== false && data.isOpen !== 'false' && data.isClosed !== true && data.isClosed !== 'true' && isShopActive;

              // Live status check against VendorDB vendors collection
              if (VendorDB) {
                try {
                  const cleanId = String(docSnap.id).replace(/^vendor-Id-/, '');
                  const idVariants = [docSnap.id, cleanId, \`vendor-Id-\${cleanId}\`];
                  for (const vId of idVariants) {
                    const vDoc = await getDoc(doc(VendorDB, 'vendors', vId)).catch(() => null);
                    if (vDoc && vDoc.exists()) {
                      const vData = vDoc.data();
                      if (vData.isActive === false || vData.isOpen === false || vData.isClosed === true) {
                        isShopActive = false;
                        isShopOpen = false;
                      }
                      break;
                    }
                  }
                } catch (_) {}
              }

              return {
                id: docSnap.id,
                name: data.shopName || data.name || 'Restaurant',
                location: address,
                latitude: lat,
                longitude: lng,
                image: image,
                ownerUid: data.ownerUid || null,
                isPureVeg: isPureVeg,
                cuisine: cuisine,
                rating: rating,
                prepTime: prepTime,
                isOpen: isShopOpen,
                isActive: isShopActive,
                isClosed: !isShopOpen,
              };
            }));`;

const replacement = `            // Fast parallel vendor checks using Promise.all - only shops with Food Mode enabled appear
            const mappedRestaurants = await Promise.all(foodDocs.map(async (docSnap) => {
              const data = docSnap.data();
              let isFoodEnabledLive = data.isFoodEnabled === true || data.isFoodEnabled === 'true';

              let isShopActive = data.isActive !== false && data.isActive !== 'false';
              let isShopOpen = data.isOpen !== false && data.isOpen !== 'false' && data.isClosed !== true && data.isClosed !== 'true' && isShopActive;

              // Live status check against VendorDB vendors collection
              if (VendorDB) {
                try {
                  const cleanId = String(docSnap.id).replace(/^vendor-Id-/, '');
                  const idVariants = [docSnap.id, cleanId, \`vendor-Id-\${cleanId}\`];
                  for (const vId of idVariants) {
                    const vDoc = await getDoc(doc(VendorDB, 'vendors', vId)).catch(() => null);
                    if (vDoc && vDoc.exists()) {
                      const vData = vDoc.data();
                      if (vData.isFoodEnabled === false || vData.isFoodEnabled === 'false') {
                        isFoodEnabledLive = false;
                      }
                      if (vData.isActive === false || vData.isOpen === false || vData.isClosed === true) {
                        isShopActive = false;
                        isShopOpen = false;
                      }
                      break;
                    }
                  }
                } catch (_) {}
              }

              // Exclude if vendor disabled Food Mode
              if (!isFoodEnabledLive) return null;

              const lat = data.location?.latitude ?? data.location?._latitude ?? null;
              const lng = data.location?.longitude ?? data.location?._longitude ?? null;
              const address = data.address || data.location?.address || (typeof data.location === 'string' ? data.location : '');
              const image = data.shopImage || data.image || null;
              const isPureVeg = data.isPureVeg === true || data.isPureVeg === 'true' || data.pureVeg === true || data.isVeg === true;
              const cuisine = data.cuisine || data.category || '';
              const rating = typeof data.rating === 'number' ? data.rating : (parseFloat(data.rating) || 4.5);
              const prepTime = typeof data.prepTime === 'number' ? data.prepTime : (parseInt(data.prepTime, 10) || 5);

              return {
                id: docSnap.id,
                name: data.shopName || data.name || 'Restaurant',
                location: address,
                latitude: lat,
                longitude: lng,
                image: image,
                ownerUid: data.ownerUid || null,
                isPureVeg: isPureVeg,
                cuisine: cuisine,
                rating: rating,
                prepTime: prepTime,
                isOpen: isShopOpen,
                isActive: isShopActive,
                isClosed: !isShopOpen,
                isFoodEnabled: true,
              };
            }));
            restaurants = mappedRestaurants.filter(Boolean);`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  console.log('Successfully replaced fetchFoodRestaurants in Dashboard.js');
} else {
  console.log('Error: target not found');
}

if (isCRLF) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(path, content, 'utf8');
console.log('Saved Dashboard.js');
