import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Text, TextInput } from 'react-native-paper';
import { Screen } from '../../components/common/Screen';
import { useCreateSubscriptionMutation, useSubscriptionStatusQuery, useVerifySubscriptionMutation } from '../../api/paymentsApi';
import { COLORS } from '../../constants/colors';
import { HeroHeader } from '../../components/common/HeroHeader';

export const PremiumScreen = () => {
  const { data: status } = useSubscriptionStatusQuery();
  const [amount, setAmount] = useState('199');
  const [orderId, setOrderId] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [signature, setSignature] = useState('');

  const [createSubscription, { isLoading: creating }] = useCreateSubscriptionMutation();
  const [verifySubscription, { isLoading: verifying }] = useVerifySubscriptionMutation();

  const handleCreate = async () => {
    const response = await createSubscription({ amount: Number(amount), currency: 'INR', provider: 'razorpay' }).unwrap();
    if (response.order && typeof response.order === 'object') {
      const order = response.order as any;
      setOrderId(order.id ?? '');
    }
  };

  const handleVerify = async () => {
    await verifySubscription({ orderId, paymentId, signature }).unwrap();
  };

  return (
    <Screen scroll>
      <HeroHeader title="Premium" subtitle="Unlock advanced features and exports" icon="star" />
      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Text>Status: {status?.status ?? 'INACTIVE'}</Text>
          {status?.premiumExpiresAt ? <Text>Expires: {status.premiumExpiresAt}</Text> : null}
        </Card.Content>
      </Card>

      <Card style={styles.formCard} mode="contained">
        <Card.Content>
          <TextInput mode="outlined" label="Amount (INR)" value={amount} onChangeText={setAmount} keyboardType="numeric" style={styles.input} />
          <Button mode="contained" onPress={handleCreate} loading={creating}>
            Create Razorpay order
          </Button>

          <TextInput mode="outlined" label="Order ID" value={orderId} onChangeText={setOrderId} style={styles.input} />
          <TextInput mode="outlined" label="Payment ID" value={paymentId} onChangeText={setPaymentId} style={styles.input} />
          <TextInput mode="outlined" label="Signature" value={signature} onChangeText={setSignature} style={styles.input} />
          <Button mode="outlined" onPress={handleVerify} loading={verifying} style={styles.verifyButton}>
            Verify payment
          </Button>
        </Card.Content>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: 12, backgroundColor: '#ffffff', borderRadius: 0, marginHorizontal: -20 },
  formCard: { borderRadius: 0, backgroundColor: '#ffffff', marginHorizontal: -20 },
  input: { marginBottom: 12, backgroundColor: '#ffffff' },
  verifyButton: { marginTop: 6 }
});
