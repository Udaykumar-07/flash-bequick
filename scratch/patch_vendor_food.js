const fs = require('fs');

const foodPath = 'c:/Users/uk/Pictures/flash-partner3/app/(tabs)/Food.js';
let content = fs.readFileSync(foodPath, 'utf8');

// 1. State changes: add editAvailable, togglingId
const oldState = `  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [saving, setSaving] = useState(false);
  const [shopDetails, setShopDetails] = useState(null);`;

const newState = `  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editAvailable, setEditAvailable] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [shopDetails, setShopDetails] = useState(null);`;

if (content.includes(oldState)) {
  content = content.replace(oldState, newState);
  console.log('Replaced states in Food.js');
} else {
  console.log('Warning: oldState not found');
}

// 2. Replace totalItems with totalItems + availableCount + unavailableCount
const oldTotal = `  const totalItems = foodItems.length;

  // Inline edit handlers
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditPrice(String(item.price ?? ''));
    setEditQuantity(String(item.quantity ?? ''));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditPrice('');
    setEditQuantity('');
  };

  const saveEdit = async (item) => {
    const newPrice = parseFloat(editPrice);
    const newQty = parseInt(editQuantity, 10);
    if (isNaN(newPrice) || newPrice < 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price.');
      return;
    }
    if (isNaN(newQty) || newQty < 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity.');
      return;
    }

    setSaving(true);
    try {
      // 1. Primary write: update vendor food items subcollection (Native SDK - fast, reliable)
      await firestore()
        .collection('vendors')
        .doc(vendorId)
        .collection('foodItems')
        .doc(item.id)
        .update({
          price: newPrice,
          quantity: newQty,
          available: newQty > 0,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });`;

const newTotalAndEdit = `  const totalItems = foodItems.length;
  const availableCount = useMemo(() => {
    return foodItems.filter(p => p.available !== false && (p.quantity === undefined || Number(p.quantity) > 0)).length;
  }, [foodItems]);
  const unavailableCount = totalItems - availableCount;

  // Direct one-tap availability toggle
  const toggleAvailability = async (item) => {
    const currentAvailable = item.available !== false && (item.quantity === undefined || Number(item.quantity) > 0);
    const newAvailable = !currentAvailable;
    const newQty = newAvailable ? 999 : 0;
    const currentPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price || 0);

    setTogglingId(item.id);
    try {
      // 1. Primary update in vendor subcollection
      await firestore()
        .collection('vendors')
        .doc(vendorId)
        .collection('foodItems')
        .doc(item.id)
        .update({
          available: newAvailable,
          quantity: newQty,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      // 2. SharedDB Stock sync via REST API
      if (item.name) {
        (async () => {
          try {
            const projectId = 'flashshared';
            const apiKey = process.env.EXPO_PUBLIC_SHARED_API_KEY || '';
            const url = \`https://firestore.googleapis.com/v1/projects/\${projectId}/databases/(default)/documents/Stock/\${encodeURIComponent(item.name)}?key=\${apiKey}&updateMask.fieldPaths=\\\`\${vendorId}.available\\\`&updateMask.fieldPaths=\\\`\${vendorId}.quantity\\\`\`;
            const payload = {
              fields: {
                [vendorId]: {
                  mapValue: {
                    fields: {
                      price: { doubleValue: currentPrice },
                      quantity: { integerValue: String(newQty) },
                      available: { booleanValue: newAvailable },
                    }
                  }
                }
              }
            };
            await fetch(url, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
          } catch (err) {
            console.warn('[Food] Stock toggle sync warning:', err?.message);
          }
        })();
      }

      // 3. SharedDB FoodItems sync
      const docId = item.sharedDbId || item.id;
      if (docId) {
        (async () => {
          try {
            const timestampIso = new Date().toISOString();
            const payload = {
              fields: {
                available: { booleanValue: newAvailable },
                quantity: { integerValue: String(newQty) },
                updatedAt: { timestampValue: timestampIso },
              }
            };
            const projectId = 'flashshared';
            const apiKey = process.env.EXPO_PUBLIC_SHARED_API_KEY || '';
            const url = \`https://firestore.googleapis.com/v1/projects/\${projectId}/databases/(default)/documents/FoodItems/\${encodeURIComponent(docId)}?key=\${apiKey}&updateMask.fieldPaths=available&updateMask.fieldPaths=quantity&updateMask.fieldPaths=updatedAt\`;
            await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          } catch (e) {
            console.warn('[Food] FoodItems toggle sync warning:', e?.message);
          }
        })();
      }
    } catch (err) {
      console.warn('Error toggling availability:', err);
      Alert.alert('Error', 'Failed to update availability.');
    } finally {
      setTogglingId(null);
    }
  };

  // Inline edit handlers
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditPrice(String(item.price ?? ''));
    const isAvail = item.available !== false && (item.quantity === undefined || Number(item.quantity) > 0);
    setEditAvailable(isAvail);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditPrice('');
    setEditAvailable(true);
  };

  const saveEdit = async (item) => {
    const newPrice = parseFloat(editPrice);
    if (isNaN(newPrice) || newPrice < 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price.');
      return;
    }
    const newQty = editAvailable ? 999 : 0;

    setSaving(true);
    try {
      // 1. Primary write: update vendor food items subcollection (Native SDK - fast, reliable)
      await firestore()
        .collection('vendors')
        .doc(vendorId)
        .collection('foodItems')
        .doc(item.id)
        .update({
          price: newPrice,
          quantity: newQty,
          available: editAvailable,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });`;

if (content.includes(oldTotal)) {
  content = content.replace(oldTotal, newTotalAndEdit);
  console.log('Replaced edit and handlers in Food.js');
} else {
  console.log('Warning: oldTotal not found');
}

// 3. Replace renderEditForm and renderItem
const oldRenderForms = `  const renderEditForm = (item) => (
    <View style={styles.editContainer}>
      <View style={styles.editRow}>
        <View style={styles.editFieldWrap}>
          <Text style={styles.editFieldLabel}>Price (₹)</Text>
          <TextInput style={styles.editInput} value={editPrice} onChangeText={setEditPrice} keyboardType="numeric" placeholder="0" placeholderTextColor={palette.muted} />
        </View>
        <View style={styles.editFieldWrap}>
          <Text style={styles.editFieldLabel}>Quantity</Text>
          <TextInput style={styles.editInput} value={editQuantity} onChangeText={setEditQuantity} keyboardType="number-pad" placeholder="0" placeholderTextColor={palette.muted} />
        </View>
      </View>
      <View style={styles.editActions}>
        <TouchableOpacity style={[styles.editBtn, styles.editCancelBtn]} onPress={cancelEdit}><Text style={styles.editCancelText}>Cancel</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.editBtn, styles.editSaveBtn]} onPress={() => saveEdit(item)} disabled={saving}>
          {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.editSaveText}>Save</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = ({ item }) => {
    const isEditing = editingId === item.id;
    const qty = Number(item.quantity) || 0;
    return (
      <View style={[styles.listCard, isEditing && styles.cardEditing]}>
        <View style={styles.listCardTop}>
          <View style={styles.iconWrap}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
            ) : (
              <Ionicons name="fast-food" size={28} color={palette.accent} />
            )}
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.productName} numberOfLines={1}>{item.name || 'Unnamed Item'}</Text>
            <Text style={styles.categoryLabel}>{item.category || 'Uncategorized'}</Text>
            <Text style={styles.productPrice}>₹{Number(item.price || 0).toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.listCardRight}>
            <View style={[styles.qtyBadge, qty === 0 && styles.qtyBadgeZero]}>
              <Text style={[styles.qtyBadgeText, qty === 0 && { color: palette.danger }]}>{qty}</Text>
            </View>
            {!isEditing && (
              <View style={styles.actionBtns}>
                <TouchableOpacity onPress={() => startEdit(item)} style={styles.iconBtn}><Ionicons name="pencil" size={17} color={palette.accent} /></TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} style={styles.iconBtn}><Ionicons name="trash-outline" size={17} color={palette.danger} /></TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        {isEditing && renderEditForm(item)}
      </View>
    );
  };`;

const newRenderForms = `  const renderEditForm = (item) => (
    <View style={styles.editContainer}>
      <View style={styles.editRow}>
        <View style={[styles.editFieldWrap, { flex: 1 }]}>
          <Text style={styles.editFieldLabel}>Price (₹)</Text>
          <TextInput style={styles.editInput} value={editPrice} onChangeText={setEditPrice} keyboardType="numeric" placeholder="0" placeholderTextColor={palette.muted} />
        </View>
        <View style={[styles.editFieldWrap, { flex: 1.4 }]}>
          <Text style={styles.editFieldLabel}>Availability</Text>
          <View style={styles.editToggleRow}>
            <TouchableOpacity
              onPress={() => setEditAvailable(true)}
              style={[styles.editToggleBtn, editAvailable && styles.editToggleBtnActive]}
              activeOpacity={0.7}
            >
              <Ionicons name="checkmark-circle" size={14} color={editAvailable ? '#22c55e' : palette.muted} />
              <Text style={[styles.editToggleText, editAvailable && styles.editToggleTextActive]}>Available</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setEditAvailable(false)}
              style={[styles.editToggleBtn, !editAvailable && styles.editToggleBtnInactive]}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={14} color={!editAvailable ? '#ef4444' : palette.muted} />
              <Text style={[styles.editToggleText, !editAvailable && styles.editToggleTextInactive]}>Unavailable</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.editActions}>
        <TouchableOpacity style={[styles.editBtn, styles.editCancelBtn]} onPress={cancelEdit}><Text style={styles.editCancelText}>Cancel</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.editBtn, styles.editSaveBtn]} onPress={() => saveEdit(item)} disabled={saving}>
          {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.editSaveText}>Save</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = ({ item }) => {
    const isEditing = editingId === item.id;
    const isAvail = item.available !== false && (item.quantity === undefined || Number(item.quantity) > 0);
    const isToggling = togglingId === item.id;

    return (
      <View style={[styles.listCard, isEditing && styles.cardEditing, !isAvail && styles.cardUnavailable]}>
        <View style={styles.listCardTop}>
          <View style={styles.iconWrap}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
            ) : (
              <Ionicons name="fast-food" size={28} color={palette.accent} />
            )}
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.productName, !isAvail && styles.productNameUnavailable]} numberOfLines={1}>{item.name || 'Unnamed Item'}</Text>
            <Text style={styles.categoryLabel}>{item.category || 'Uncategorized'}</Text>
            <Text style={styles.productPrice}>₹{Number(item.price || 0).toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.listCardRight}>
            {/* Interactive Available / Unavailable button */}
            <TouchableOpacity
              onPress={() => toggleAvailability(item)}
              disabled={isToggling || isEditing}
              style={[
                styles.availBtn,
                isAvail ? styles.availBtnActive : styles.availBtnInactive
              ]}
              activeOpacity={0.7}
            >
              {isToggling ? (
                <ActivityIndicator size="small" color={isAvail ? '#22c55e' : '#ef4444'} />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons
                    name={isAvail ? "checkmark-circle" : "close-circle"}
                    size={13}
                    color={isAvail ? '#22c55e' : '#ef4444'}
                  />
                  <Text style={[styles.availBtnText, isAvail ? styles.availBtnTextActive : styles.availBtnTextInactive]}>
                    {isAvail ? 'Available' : 'Unavailable'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {!isEditing && (
              <View style={styles.actionBtns}>
                <TouchableOpacity onPress={() => startEdit(item)} style={styles.iconBtn}><Ionicons name="pencil" size={17} color={palette.accent} /></TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} style={styles.iconBtn}><Ionicons name="trash-outline" size={17} color={palette.danger} /></TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        {isEditing && renderEditForm(item)}
      </View>
    );
  };`;

if (content.includes(oldRenderForms)) {
  content = content.replace(oldRenderForms, newRenderForms);
  console.log('Replaced renderForms in Food.js');
} else {
  console.log('Warning: oldRenderForms not found');
}

// 4. Update stats cards
const oldStats = `      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="fast-food-outline" size={22} color={palette.accent} style={{ marginBottom: 4 }} />
          <Text style={styles.statValue}>{totalItems}</Text>
          <Text style={styles.statLabel}>Menu Items</Text>
        </View>
      </View>`;

const newStats = `      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="fast-food-outline" size={20} color={palette.accent} style={{ marginBottom: 4 }} />
          <Text style={styles.statValue}>{totalItems}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#22c55e" style={{ marginBottom: 4 }} />
          <Text style={[styles.statValue, { color: '#22c55e' }]}>{availableCount}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="close-circle-outline" size={20} color="#ef4444" style={{ marginBottom: 4 }} />
          <Text style={[styles.statValue, { color: '#ef4444' }]}>{unavailableCount}</Text>
          <Text style={styles.statLabel}>Unavailable</Text>
        </View>
      </View>`;

if (content.includes(oldStats)) {
  content = content.replace(oldStats, newStats);
  console.log('Replaced stats in Food.js');
} else {
  console.log('Warning: oldStats not found');
}

// 5. Add styles
const oldStylesEnd = `  qtyBadgeText: { fontSize: 13, fontWeight: '700', color: palette.success },`;
const newStylesEnd = `  qtyBadgeText: { fontSize: 13, fontWeight: '700', color: palette.success },
  cardUnavailable: {
    opacity: 0.72,
    borderColor: '#262626',
  },
  productNameUnavailable: {
    color: '#9ca3af',
  },
  availBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availBtnActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderColor: 'rgba(34, 197, 94, 0.4)',
  },
  availBtnInactive: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  availBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  availBtnTextActive: {
    color: '#22c55e',
  },
  availBtnTextInactive: {
    color: '#ef4444',
  },
  editToggleRow: {
    flexDirection: 'row',
    gap: 6,
  },
  editToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: palette.background,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 4,
  },
  editToggleBtnActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: '#22c55e',
  },
  editToggleBtnInactive: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#ef4444',
  },
  editToggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: palette.muted,
  },
  editToggleTextActive: {
    color: '#22c55e',
    fontWeight: '700',
  },
  editToggleTextInactive: {
    color: '#ef4444',
    fontWeight: '700',
  },`;

if (content.includes(oldStylesEnd)) {
  content = content.replace(oldStylesEnd, newStylesEnd);
  console.log('Added styles in Food.js');
}

fs.writeFileSync(foodPath, content, 'utf8');
console.log('Food.js saved successfully');
