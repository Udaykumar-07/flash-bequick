const fs = require('fs');

const path = 'c:/Users/uk/Pictures/flash-partner3/app/(tabs)/Profile.js';
let content = fs.readFileSync(path, 'utf8');

// 1. In handleToggleStockManagement: block when Food Mode is active
const oldToggleStock = `  const handleToggleStockManagement = async (value) => {
    if (value) {
      Alert.alert(
        "Enable Stock Management",
        "Are you sure you want to enable Stock Management? This will change your app experience, allowing direct payments and live stock updates for customers.",
        [
          {
            text: t('cancel') || "Cancel",
            style: "cancel",
          },
          {
            text: t('yes') || "Yes",
            onPress: () => updateStockManagementSetting(true),
          },
        ]
      );
    } else {
      await updateStockManagementSetting(false);
    }
  };`;

const newToggleStock = `  const handleToggleStockManagement = async (value) => {
    if (value && userDetails.isFoodEnabled) {
      Alert.alert(
        "Food Mode Active",
        "Stock Management cannot be enabled while Food Mode is on. In Food Mode, items are managed with Available / Unavailable buttons.\\n\\nPlease disable Food Mode first if you want to use Stock Management for groceries.",
        [{ text: "OK" }]
      );
      return;
    }
    if (value) {
      Alert.alert(
        "Enable Stock Management",
        "Are you sure you want to enable Stock Management? This will change your app experience, allowing direct payments and live stock updates for customers.",
        [
          {
            text: t('cancel') || "Cancel",
            style: "cancel",
          },
          {
            text: t('yes') || "Yes",
            onPress: () => updateStockManagementSetting(true),
          },
        ]
      );
    } else {
      await updateStockManagementSetting(false);
    }
  };`;

if (content.includes(oldToggleStock)) {
  content = content.replace(oldToggleStock, newToggleStock);
  console.log('Replaced handleToggleStockManagement in Profile.js');
} else {
  console.log('Warning: oldToggleStock not found');
}

// 2. In handleToggleFoodMode: inform about automatic stock management disabling
const oldToggleFood = `  const handleToggleFoodMode = async (value) => {
    if (value) {
      Alert.alert("Enable Food Mode", "Enable Food Mode? Customers can see your restaurant.", [
        { text: t('cancel') || "Cancel", style: "cancel" },
        { text: t('yes') || "Yes", onPress: () => updateFoodModeSetting(true) },
      ]);
    } else { await updateFoodModeSetting(false); }
  };`;

const newToggleFood = `  const handleToggleFoodMode = async (value) => {
    if (value) {
      Alert.alert(
        "Enable Food Mode",
        "Enable Food Mode? Your shop will be listed in the Food section and Stock Management will automatically be disabled (food items are managed via Available / Unavailable buttons).",
        [
          { text: t('cancel') || "Cancel", style: "cancel" },
          { text: t('yes') || "Yes", onPress: () => updateFoodModeSetting(true) },
        ]
      );
    } else {
      await updateFoodModeSetting(false);
    }
  };`;

if (content.includes(oldToggleFood)) {
  content = content.replace(oldToggleFood, newToggleFood);
  console.log('Replaced handleToggleFoodMode in Profile.js');
} else {
  console.log('Warning: oldToggleFood not found');
}

// 3. In updateFoodModeSetting: automatically disable stock management in VendorDB and SharedDB
const oldUpdateFood = `  const updateFoodModeSetting = async (enabled) => {
    if (!vendorId) { showCustomAlert("Error", "Vendor ID is missing."); return; }
    if (!uid) { showCustomAlert("Error", "User not authenticated."); return; }
    setSaving(true);
    try {
      await firestoreDb.collection("vendors").doc(vendorId).update({ isFoodEnabled: enabled, updatedAt: firestore.FieldValue.serverTimestamp() });
      setUserDetails((prev) => ({ ...prev, isFoodEnabled: enabled }));
      try {
        const timestampIso = new Date().toISOString();
        const payload = { fields: { isFoodEnabled: { booleanValue: enabled }, lastUpdated: { timestampValue: timestampIso } } };
        const projectId = 'flashshared'; const apiKey = process.env.EXPO_PUBLIC_SHARED_API_KEY;
        const url = \`https://firestore.googleapis.com/v1/projects/\${projectId}/databases/(default)/documents/Shops/\${vendorId}?key=\${apiKey}&updateMask.fieldPaths=isFoodEnabled&updateMask.fieldPaths=lastUpdated\`;
        const response = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (response.ok) { showCustomAlert("Success", "Food Mode " + (enabled ? "enabled" : "disabled") + " successfully!"); }
        else { showCustomAlert("Warning", "Food Mode updated locally but sync failed."); }
      } catch (syncErr) { console.error("[Food Mode] sync error:", syncErr); }
    } catch (error) {
      console.error("[Food Mode] Error:", error);
      setUserDetails((prev) => ({ ...prev, isFoodEnabled: !enabled }));
    } finally { setSaving(false); }
  };`;

const newUpdateFood = `  const updateFoodModeSetting = async (enabled) => {
    if (!vendorId) { showCustomAlert("Error", "Vendor ID is missing."); return; }
    if (!uid) { showCustomAlert("Error", "User not authenticated."); return; }
    setSaving(true);
    try {
      // When Food Mode is enabled, automatically disable stock management
      const updatePayload = {
        isFoodEnabled: enabled,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };
      if (enabled) {
        updatePayload.isStockManagementEnabled = false;
      }
      await firestoreDb.collection("vendors").doc(vendorId).update(updatePayload);
      setUserDetails((prev) => ({
        ...prev,
        isFoodEnabled: enabled,
        ...(enabled ? { isStockManagementEnabled: false } : {}),
      }));

      try {
        const timestampIso = new Date().toISOString();
        const payload = {
          fields: {
            isFoodEnabled: { booleanValue: enabled },
            lastUpdated: { timestampValue: timestampIso }
          }
        };
        if (enabled) {
          payload.fields.isStockManagementEnabled = { booleanValue: false };
        }
        const projectId = 'flashshared';
        const apiKey = process.env.EXPO_PUBLIC_SHARED_API_KEY;
        const fieldPaths = enabled
          ? '&updateMask.fieldPaths=isFoodEnabled&updateMask.fieldPaths=isStockManagementEnabled&updateMask.fieldPaths=lastUpdated'
          : '&updateMask.fieldPaths=isFoodEnabled&updateMask.fieldPaths=lastUpdated';
        const url = \`https://firestore.googleapis.com/v1/projects/\${projectId}/databases/(default)/documents/Shops/\${vendorId}?key=\${apiKey}\${fieldPaths}\`;
        const response = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (response.ok) {
          showCustomAlert("Success", "Food Mode " + (enabled ? "enabled (Stock Management automatically disabled)" : "disabled") + " successfully!");
        } else {
          showCustomAlert("Warning", "Food Mode updated locally but sync failed.");
        }
      } catch (syncErr) { console.error("[Food Mode] sync error:", syncErr); }
    } catch (error) {
      console.error("[Food Mode] Error:", error);
      setUserDetails((prev) => ({ ...prev, isFoodEnabled: !enabled }));
    } finally { setSaving(false); }
  };`;

if (content.includes(oldUpdateFood)) {
  content = content.replace(oldUpdateFood, newUpdateFood);
  console.log('Replaced updateFoodModeSetting in Profile.js');
} else {
  console.log('Warning: oldUpdateFood not found');
}

// 4. In Profile.js UI Switch: show notice and disable switch when in Food Mode
const oldSwitchUi = `            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Stock Management</Text>
              <Switch
                value={userDetails.isStockManagementEnabled}
                onValueChange={handleToggleStockManagement}
                trackColor={{ false: "#767577", true: "#a5b4fc" }}
                thumbColor={userDetails.isStockManagementEnabled ? "#4f46e5" : "#f4f3f4"}
                disabled={saving || isUpdatingLocation || isSigningOut}
              />
            </View>`;

const newSwitchUi = `            <View style={styles.switchRow}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.switchLabel}>Stock Management</Text>
                {userDetails.isFoodEnabled && (
                  <Text style={{ fontSize: 11, color: '#f59e0b', marginTop: 2 }}>
                    Disabled automatically in Food Mode
                  </Text>
                )}
              </View>
              <Switch
                value={userDetails.isFoodEnabled ? false : userDetails.isStockManagementEnabled}
                onValueChange={handleToggleStockManagement}
                trackColor={{ false: "#767577", true: "#a5b4fc" }}
                thumbColor={(!userDetails.isFoodEnabled && userDetails.isStockManagementEnabled) ? "#4f46e5" : "#f4f3f4"}
                disabled={saving || isUpdatingLocation || isSigningOut || userDetails.isFoodEnabled}
              />
            </View>`;

if (content.includes(oldSwitchUi)) {
  content = content.replace(oldSwitchUi, newSwitchUi);
  console.log('Replaced switch UI in Profile.js');
} else {
  console.log('Warning: oldSwitchUi not found');
}

fs.writeFileSync(path, content, 'utf8');
console.log('Done Profile.js');
