const fs = require('fs');

const path = 'c:/Users/uk/Pictures/flash-partner3/app/AddFoodItem.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Replace states
const oldStates = `  // Inline Adding state
  const [addingItemId, setAddingItemId] = useState(null);
  const [addPrice, setAddPrice] = useState('');
  const [addQty, setAddQty] = useState('');
  const [savingAdd, setSavingAdd] = useState(false);

  // Custom item state
  const [customPrice, setCustomPrice] = useState('');
  const [customQty, setCustomQty] = useState('');`;

const newStates = `  // Inline Adding state
  const [addingItemId, setAddingItemId] = useState(null);
  const [addPrice, setAddPrice] = useState('');
  const [addAvailable, setAddAvailable] = useState(true);
  const [savingAdd, setSavingAdd] = useState(false);

  // Custom item state
  const [customPrice, setCustomPrice] = useState('');
  const [customAvailable, setCustomAvailable] = useState(true);`;

if (content.includes(oldStates)) {
  content = content.replace(oldStates, newStates);
  console.log('Replaced states in AddFoodItem.js');
} else {
  console.log('Warning: oldStates not found');
}

// 2. Replace startAddItem, cancelAdd, saveFoodItem
const oldSaveBlock = `  // Add food item to vendor's menu
  const startAddItem = (item) => {
    setAddingItemId(item.id);
    setAddPrice(String(item.price || ''));
    setAddQty('10');
  };

  const cancelAdd = () => { setAddingItemId(null); setAddPrice(''); setAddQty(''); };

  const saveFoodItem = async (item) => {
    const priceVal = parseFloat(addPrice);
    const qtyVal = parseInt(addQty, 10);
    if (isNaN(priceVal) || priceVal < 0) { Alert.alert('Invalid Price', 'Enter a valid price.'); return; }
    if (isNaN(qtyVal) || qtyVal < 0) { Alert.alert('Invalid Quantity', 'Enter a valid quantity.'); return; }
    if (localFoodIds.has(item.id)) { Alert.alert('Already Added', \`"\${item.name}" is already in your menu.\`); cancelAdd(); return; }

    setSavingAdd(true);
    try {
      const sharedDocId = \`\${item.id}-\${vendorId}\`;

      // 1. Add to vendor's foodItems subcollection (with image)
      await firestore().collection('vendors').doc(vendorId).collection('foodItems').add({
        name: item.name,
        sharedDbId: item.id,
        category: item.category || 'Uncategorized',
        price: priceVal,
        quantity: qtyVal,
        available: qtyVal > 0,
        image: item.image || null,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      // 2. Non-blocking sync to SharedDB Stock via REST API
      (async () => {
        try {
          const projectId = 'flashshared';
          const apiKey = process.env.EXPO_PUBLIC_SHARED_API_KEY || '';
          const url = \`https://firestore.googleapis.com/v1/projects/\${projectId}/databases/(default)/documents/Stock/\${encodeURIComponent(item.name)}?key=\${apiKey}&updateMask.fieldPaths=\\\`\${vendorId}\\\`\`;
          const payload = {
            fields: {
              [vendorId]: {
                mapValue: {
                  fields: {
                    price: { doubleValue: priceVal },
                    quantity: { integerValue: String(qtyVal) },
                    available: { booleanValue: qtyVal > 0 },
                    shopName: { stringValue: shopDetails.shopName || '' },
                    isFood: { booleanValue: true },
                  }
                }
              }
            }
          };
          await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        } catch (stockSyncErr) {
          console.warn('[AddFoodItem] SharedDB Stock sync notice:', stockSyncErr?.message);
        }
      })();

      // 3. Save to SharedDB FoodItems collection (isolated per restaurant)
      const timestampIso = new Date().toISOString();
      const payload = {
        fields: {
          name: { stringValue: item.name },
          category: { stringValue: item.category || 'Uncategorized' },
          price: { doubleValue: priceVal },
          quantity: { integerValue: String(qtyVal) },
          available: { booleanValue: qtyVal > 0 },
          restaurantId: { stringValue: vendorId },
          restaurantName: { stringValue: shopDetails.shopName || '' },
          updatedAt: { timestampValue: timestampIso },
        }
      };`;

const newSaveBlock = `  // Add food item to vendor's menu
  const startAddItem = (item) => {
    setAddingItemId(item.id);
    setAddPrice(String(item.price || ''));
    setAddAvailable(true);
  };

  const cancelAdd = () => { setAddingItemId(null); setAddPrice(''); setAddAvailable(true); };

  const saveFoodItem = async (item) => {
    const priceVal = parseFloat(addPrice);
    if (isNaN(priceVal) || priceVal < 0) { Alert.alert('Invalid Price', 'Enter a valid price.'); return; }
    if (localFoodIds.has(item.id)) { Alert.alert('Already Added', \`"\${item.name}" is already in your menu.\`); cancelAdd(); return; }

    const qtyVal = addAvailable ? 999 : 0;
    setSavingAdd(true);
    try {
      const sharedDocId = \`\${item.id}-\${vendorId}\`;

      // 1. Add to vendor's foodItems subcollection (with image)
      await firestore().collection('vendors').doc(vendorId).collection('foodItems').add({
        name: item.name,
        sharedDbId: item.id,
        category: item.category || 'Uncategorized',
        price: priceVal,
        quantity: qtyVal,
        available: addAvailable,
        image: item.image || null,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      // 2. Non-blocking sync to SharedDB Stock via REST API
      (async () => {
        try {
          const projectId = 'flashshared';
          const apiKey = process.env.EXPO_PUBLIC_SHARED_API_KEY || '';
          const url = \`https://firestore.googleapis.com/v1/projects/\${projectId}/databases/(default)/documents/Stock/\${encodeURIComponent(item.name)}?key=\${apiKey}&updateMask.fieldPaths=\\\`\${vendorId}\\\`\`;
          const payload = {
            fields: {
              [vendorId]: {
                mapValue: {
                  fields: {
                    price: { doubleValue: priceVal },
                    quantity: { integerValue: String(qtyVal) },
                    available: { booleanValue: addAvailable },
                    shopName: { stringValue: shopDetails.shopName || '' },
                    isFood: { booleanValue: true },
                  }
                }
              }
            }
          };
          await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        } catch (stockSyncErr) {
          console.warn('[AddFoodItem] SharedDB Stock sync notice:', stockSyncErr?.message);
        }
      })();

      // 3. Save to SharedDB FoodItems collection (isolated per restaurant)
      const timestampIso = new Date().toISOString();
      const payload = {
        fields: {
          name: { stringValue: item.name },
          category: { stringValue: item.category || 'Uncategorized' },
          price: { doubleValue: priceVal },
          quantity: { integerValue: String(qtyVal) },
          available: { booleanValue: addAvailable },
          restaurantId: { stringValue: vendorId },
          restaurantName: { stringValue: shopDetails.shopName || '' },
          updatedAt: { timestampValue: timestampIso },
        }
      };`;

if (content.includes(oldSaveBlock)) {
  content = content.replace(oldSaveBlock, newSaveBlock);
  console.log('Replaced saveFoodItem in AddFoodItem.js');
} else {
  console.log('Warning: oldSaveBlock not found');
}

// 3. Replace saveCustomFoodItem
const oldCustomBlock = `  // Custom food item
  const saveCustomFoodItem = async () => {
    const nameText = searchQuery.trim();
    const priceVal = parseFloat(customPrice);
    const qtyVal = parseInt(customQty, 10);
    const categoryText = customCategory.trim() || 'Uncategorized';
    if (!nameText) return;
    if (isNaN(priceVal) || priceVal < 0) { Alert.alert('Invalid Price'); return; }
    if (isNaN(qtyVal) || qtyVal < 0) { Alert.alert('Invalid Quantity'); return; }

    setSavingCustom(true);
    try {
      const itemId = nameText.toLowerCase().replace(/\\s+/g, '-');
      const sharedDocId = \`\${itemId}-\${vendorId}\`;

      await firestore().collection('vendors').doc(vendorId).collection('foodItems').add({
        name: nameText,
        sharedDbId: itemId,
        category: categoryText,
        price: priceVal,
        quantity: qtyVal,
        available: qtyVal > 0,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      // Save to DBShared Stock collection
      try {
        if (DBShared) {
          await setDoc(doc(DBShared, 'Stock', nameText), {
            name: nameText,
            category: categoryText,
            isFood: true,
            [vendorId]: {
              price: priceVal,
              quantity: qtyVal,
              available: qtyVal > 0,
              shopName: shopDetails.shopName || '',
              location: shopDetails.location || null,
              isFood: true,
            }
          }, { merge: true });
        }
      } catch (stockSyncErr) {
        console.warn('DBShared Stock custom sync notice:', stockSyncErr?.message);
      }

      const timestampIso = new Date().toISOString();
      const payload = {
        fields: {
          name: { stringValue: nameText },
          category: { stringValue: categoryText },
          price: { doubleValue: priceVal },
          quantity: { integerValue: String(qtyVal) },
          available: { booleanValue: qtyVal > 0 },
          restaurantId: { stringValue: vendorId },
          restaurantName: { stringValue: shopDetails.shopName || '' },
          updatedAt: { timestampValue: timestampIso },
        }
      };
      const projectId = 'flashshared';
      const apiKey = process.env.EXPO_PUBLIC_SHARED_API_KEY;
      await fetch(\`https://firestore.googleapis.com/v1/projects/\${projectId}/databases/(default)/documents/FoodItems/\${encodeURIComponent(sharedDocId)}?key=\${apiKey}\`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });

      // Also add to FoodCatalog for other vendors
      await fetch(\`https://firestore.googleapis.com/v1/projects/\${projectId}/databases/(default)/documents/FoodCatalog/\${encodeURIComponent(itemId)}?key=\${apiKey}\`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: { name: { stringValue: nameText }, category: { stringValue: categoryText }, price: { doubleValue: priceVal }, updatedAt: { timestampValue: timestampIso } } }),
      });

      setCatalogItems((prev) => [...prev, { id: itemId, name: nameText, nameLower: nameText.toLowerCase(), category: categoryText, price: priceVal, image: null }]);
      setSearchQuery(''); setCustomPrice(''); setCustomQty(''); setCustomCategory('');`;

const newCustomBlock = `  // Custom food item
  const saveCustomFoodItem = async () => {
    const nameText = searchQuery.trim();
    const priceVal = parseFloat(customPrice);
    const categoryText = customCategory.trim() || 'Uncategorized';
    if (!nameText) return;
    if (isNaN(priceVal) || priceVal < 0) { Alert.alert('Invalid Price'); return; }

    const qtyVal = customAvailable ? 999 : 0;
    setSavingCustom(true);
    try {
      const itemId = nameText.toLowerCase().replace(/\\s+/g, '-');
      const sharedDocId = \`\${itemId}-\${vendorId}\`;

      await firestore().collection('vendors').doc(vendorId).collection('foodItems').add({
        name: nameText,
        sharedDbId: itemId,
        category: categoryText,
        price: priceVal,
        quantity: qtyVal,
        available: customAvailable,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      // Save to DBShared Stock collection
      try {
        if (DBShared) {
          await setDoc(doc(DBShared, 'Stock', nameText), {
            name: nameText,
            category: categoryText,
            isFood: true,
            [vendorId]: {
              price: priceVal,
              quantity: qtyVal,
              available: customAvailable,
              shopName: shopDetails.shopName || '',
              location: shopDetails.location || null,
              isFood: true,
            }
          }, { merge: true });
        }
      } catch (stockSyncErr) {
        console.warn('DBShared Stock custom sync notice:', stockSyncErr?.message);
      }

      const timestampIso = new Date().toISOString();
      const payload = {
        fields: {
          name: { stringValue: nameText },
          category: { stringValue: categoryText },
          price: { doubleValue: priceVal },
          quantity: { integerValue: String(qtyVal) },
          available: { booleanValue: customAvailable },
          restaurantId: { stringValue: vendorId },
          restaurantName: { stringValue: shopDetails.shopName || '' },
          updatedAt: { timestampValue: timestampIso },
        }
      };
      const projectId = 'flashshared';
      const apiKey = process.env.EXPO_PUBLIC_SHARED_API_KEY;
      await fetch(\`https://firestore.googleapis.com/v1/projects/\${projectId}/databases/(default)/documents/FoodItems/\${encodeURIComponent(sharedDocId)}?key=\${apiKey}\`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });

      // Also add to FoodCatalog for other vendors
      await fetch(\`https://firestore.googleapis.com/v1/projects/\${projectId}/databases/(default)/documents/FoodCatalog/\${encodeURIComponent(itemId)}?key=\${apiKey}\`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: { name: { stringValue: nameText }, category: { stringValue: categoryText }, price: { doubleValue: priceVal }, updatedAt: { timestampValue: timestampIso } } }),
      });

      setCatalogItems((prev) => [...prev, { id: itemId, name: nameText, nameLower: nameText.toLowerCase(), category: categoryText, price: priceVal, image: null }]);
      setSearchQuery(''); setCustomPrice(''); setCustomAvailable(true); setCustomCategory('');`;

if (content.includes(oldCustomBlock)) {
  content = content.replace(oldCustomBlock, newCustomBlock);
  console.log('Replaced saveCustomFoodItem in AddFoodItem.js');
} else {
  console.log('Warning: oldCustomBlock not found');
}

// 4. In renderItemCard: replace Qty input with Availability buttons
const oldInlineAdd = `        ) : isAdding ? (
          <View style={styles.inlineAddContainer}>
            <View style={styles.inlineInputRow}>
              <View style={styles.inlineField}>
                <Text style={styles.inlineLabel}>Price (₹)</Text>
                <TextInput style={styles.inlineInput} value={addPrice} onChangeText={setAddPrice} keyboardType="numeric" placeholder="0" placeholderTextColor={palette.muted} />
              </View>
              <View style={styles.inlineField}>
                <Text style={styles.inlineLabel}>Qty</Text>
                <TextInput style={styles.inlineInput} value={addQty} onChangeText={setAddQty} keyboardType="number-pad" placeholder="0" placeholderTextColor={palette.muted} />
              </View>
            </View>
            <View style={styles.inlineActions}>
              <TouchableOpacity style={styles.inlineCancelBtn} onPress={cancelAdd}><Text style={styles.inlineCancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.inlineSaveBtn} onPress={() => saveFoodItem(item)} disabled={savingAdd}>
                {savingAdd ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.inlineSaveText}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>`;

const newInlineAdd = `        ) : isAdding ? (
          <View style={styles.inlineAddContainer}>
            <View style={styles.inlineField}>
              <Text style={styles.inlineLabel}>Price (₹)</Text>
              <TextInput style={styles.inlineInput} value={addPrice} onChangeText={setAddPrice} keyboardType="numeric" placeholder="0" placeholderTextColor={palette.muted} />
            </View>
            <View style={{ marginTop: 6 }}>
              <Text style={styles.inlineLabel}>Availability</Text>
              <View style={styles.inlineToggleRow}>
                <TouchableOpacity
                  onPress={() => setAddAvailable(true)}
                  style={[styles.inlineToggleBtn, addAvailable && styles.inlineToggleBtnActive]}
                  activeOpacity={0.7}
                >
                  <Ionicons name="checkmark-circle" size={12} color={addAvailable ? '#22c55e' : palette.muted} />
                  <Text style={[styles.inlineToggleText, addAvailable && styles.inlineToggleTextActive]}>Available</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setAddAvailable(false)}
                  style={[styles.inlineToggleBtn, !addAvailable && styles.inlineToggleBtnInactive]}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close-circle" size={12} color={!addAvailable ? '#ef4444' : palette.muted} />
                  <Text style={[styles.inlineToggleText, !addAvailable && styles.inlineToggleTextInactive]}>Unavailable</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inlineActions}>
              <TouchableOpacity style={styles.inlineCancelBtn} onPress={cancelAdd}><Text style={styles.inlineCancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.inlineSaveBtn} onPress={() => saveFoodItem(item)} disabled={savingAdd}>
                {savingAdd ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.inlineSaveText}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>`;

if (content.includes(oldInlineAdd)) {
  content = content.replace(oldInlineAdd, newInlineAdd);
  console.log('Replaced inlineAdd in AddFoodItem.js');
} else {
  console.log('Warning: oldInlineAdd not found');
}

// 5. In renderCustomForm: replace Qty input with Availability buttons
const oldCustomRow = `        <View style={styles.customRow}>
          <View style={[styles.customGroup, { flex: 1 }]}><Text style={styles.customLabel}>Price (₹)</Text>
            <TextInput style={styles.customInput} value={customPrice} onChangeText={setCustomPrice} keyboardType="numeric" placeholder="0" placeholderTextColor={palette.muted} /></View>
          <View style={[styles.customGroup, { flex: 1 }]}><Text style={styles.customLabel}>Quantity</Text>
            <TextInput style={styles.customInput} value={customQty} onChangeText={setCustomQty} keyboardType="number-pad" placeholder="0" placeholderTextColor={palette.muted} /></View>
        </View>`;

const newCustomRow = `        <View style={styles.customRow}>
          <View style={[styles.customGroup, { flex: 1 }]}>
            <Text style={styles.customLabel}>Price (₹)</Text>
            <TextInput style={styles.customInput} value={customPrice} onChangeText={setCustomPrice} keyboardType="numeric" placeholder="0" placeholderTextColor={palette.muted} />
          </View>
          <View style={[styles.customGroup, { flex: 1.3 }]}>
            <Text style={styles.customLabel}>Availability</Text>
            <View style={styles.customToggleRow}>
              <TouchableOpacity
                onPress={() => setCustomAvailable(true)}
                style={[styles.customToggleBtn, customAvailable && styles.customToggleBtnActive]}
                activeOpacity={0.7}
              >
                <Ionicons name="checkmark-circle" size={13} color={customAvailable ? '#22c55e' : palette.muted} />
                <Text style={[styles.customToggleText, customAvailable && styles.customToggleTextActive]}>Available</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCustomAvailable(false)}
                style={[styles.customToggleBtn, !customAvailable && styles.customToggleBtnInactive]}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={13} color={!customAvailable ? '#ef4444' : palette.muted} />
                <Text style={[styles.customToggleText, !customAvailable && styles.customToggleTextInactive]}>Unavailable</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>`;

if (content.includes(oldCustomRow)) {
  content = content.replace(oldCustomRow, newCustomRow);
  console.log('Replaced customRow in AddFoodItem.js');
} else {
  console.log('Warning: oldCustomRow not found');
}

// 6. Add styles
const oldStyleEnd = `  inlineSaveText: { color: '#fff', fontWeight: '600', fontSize: 12 },`;
const newStyleEnd = `  inlineSaveText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  inlineToggleRow: { flexDirection: 'row', gap: 4, marginTop: 4 },
  inlineToggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 5, borderRadius: 6, backgroundColor: palette.background, borderWidth: 1, borderColor: palette.border, gap: 3 },
  inlineToggleBtnActive: { backgroundColor: 'rgba(34, 197, 94, 0.15)', borderColor: '#22c55e' },
  inlineToggleBtnInactive: { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: '#ef4444' },
  inlineToggleText: { fontSize: 10, fontWeight: '600', color: palette.muted },
  inlineToggleTextActive: { color: '#22c55e', fontWeight: '700' },
  inlineToggleTextInactive: { color: '#ef4444', fontWeight: '700' },
  customToggleRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  customToggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 9, borderRadius: 8, backgroundColor: palette.background, borderWidth: 1, borderColor: palette.border, gap: 4 },
  customToggleBtnActive: { backgroundColor: 'rgba(34, 197, 94, 0.15)', borderColor: '#22c55e' },
  customToggleBtnInactive: { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: '#ef4444' },
  customToggleText: { fontSize: 11, fontWeight: '600', color: palette.muted },
  customToggleTextActive: { color: '#22c55e', fontWeight: '700' },
  customToggleTextInactive: { color: '#ef4444', fontWeight: '700' },`;

if (content.includes(oldStyleEnd)) {
  content = content.replace(oldStyleEnd, newStyleEnd);
  console.log('Added styles in AddFoodItem.js');
} else {
  console.log('Warning: oldStyleEnd not found');
}

fs.writeFileSync(path, content, 'utf8');
console.log('AddFoodItem.js saved successfully');
