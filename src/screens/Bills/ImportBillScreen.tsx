import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, SegmentedButtons } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { useListGroupsQuery } from '../../api/groupsApi';
import { useParseBillMutation, useParseBlinkitMutation, useParseSwiggyMutation, useParseZomatoMutation } from '../../api/billsApi';
import { useImportBillMutation } from '../../api/expensesApi';
import { useOcrScanReceiptMutation } from '../../api/ocrApi';
import { COLORS } from '../../constants/colors';

export const ImportBillScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const initialGroupId = route.params?.groupId as string | undefined;
  const { data: groups = [] } = useListGroupsQuery();
  const [groupId, setGroupId] = useState<string | undefined>(initialGroupId);
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [source, setSource] = useState('MANUAL');
  const [parsed, setParsed] = useState<any>(null);

  const [parseBill, { isLoading: parsing }] = useParseBillMutation();
  const [parseSwiggy] = useParseSwiggyMutation();
  const [parseZomato] = useParseZomatoMutation();
  const [parseBlinkit] = useParseBlinkitMutation();
  const [importBill, { isLoading: importing }] = useImportBillMutation();
  const [scanReceipt, { isLoading: scanning }] = useOcrScanReceiptMutation();

  useEffect(() => {
    if (!groupId && groups.length > 0) {
      setGroupId(groups[0].id);
    }
  }, [groupId, groups]);

  const handleScan = async () => {
    if (!imageUrl) return;
    const result = await scanReceipt({ imageUrl, provider: 'google' }).unwrap();
    if (result.text) {
      setText(result.text);
    }
  };

  const handleParse = async () => {
    let result;
    if (source === 'SWIGGY') {
      result = await parseSwiggy({ text, source }).unwrap();
    } else if (source === 'ZOMATO') {
      result = await parseZomato({ text, source }).unwrap();
    } else if (source === 'BLINKIT') {
      result = await parseBlinkit({ text, source }).unwrap();
    } else {
      result = await parseBill({ text, source }).unwrap();
    }
    setParsed(result);
  };

  const handleImport = async () => {
    if (!groupId) return;
    const expense = await importBill({ groupId, text, source }).unwrap();
    navigation.navigate('ExpenseDetail', { expenseId: expense.id });
  };

  return (
    <Screen scroll>
      <Text variant="headlineSmall" style={styles.title}>Import bill</Text>

      <Text style={styles.label}>Group</Text>
      <View style={styles.choiceRow}>
        {groups.map((group) => (
          <Button
            key={group.id}
            mode={group.id === groupId ? 'contained' : 'outlined'}
            onPress={() => setGroupId(group.id)}
            style={styles.choiceButton}
          >
            {group.name}
          </Button>
        ))}
      </View>

      <Text style={styles.label}>Source</Text>
      <SegmentedButtons
        value={source}
        onValueChange={setSource}
        buttons={[
          { value: 'MANUAL', label: 'Manual' },
          { value: 'SWIGGY', label: 'Swiggy' },
          { value: 'ZOMATO', label: 'Zomato' },
          { value: 'BLINKIT', label: 'Blinkit' }
        ]}
      />

      <TextInput
        mode="outlined"
        label="Receipt image URL"
        value={imageUrl}
        onChangeText={setImageUrl}
        style={styles.input}
      />
      <Button mode="outlined" onPress={handleScan} loading={scanning} disabled={!imageUrl}>
        Scan via OCR
      </Button>

      <TextInput
        mode="outlined"
        label="Paste bill text"
        multiline
        value={text}
        onChangeText={setText}
        style={styles.input}
      />

      <Button mode="outlined" onPress={handleParse} loading={parsing}>
        Parse bill
      </Button>

      {parsed ? (
        <View style={styles.preview}>
          <Text style={styles.previewText}>Merchant: {parsed.merchant ?? 'Unknown'}</Text>
          <Text style={styles.previewText}>Total: {parsed.currency} {parsed.total}</Text>
          <Text style={styles.previewText}>Items: {parsed.items?.length ?? 0}</Text>
        </View>
      ) : null}

      <Button mode="contained" onPress={handleImport} loading={importing} disabled={!groupId}>
        Create expense
      </Button>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { color: COLORS.primary, marginBottom: 12 },
  label: { marginTop: 12, marginBottom: 6, color: COLORS.text },
  input: { marginVertical: 12 },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  choiceButton: { marginBottom: 6 },
  preview: { marginVertical: 12, padding: 12, borderRadius: 12, backgroundColor: '#ffffff' },
  previewText: { color: COLORS.text }
});
