import type { IPaymentCard, IAddressItem } from 'src/types/common';

import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Editor } from 'src/components/editor';
import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';

import { AddressListDialog } from '../address';
import { PaymentCardListDialog } from '../payment/payment-card-list-dialog';

// ----------------------------------------------------------------------

type Props = {
  cardList: IPaymentCard[];
  addressBook: IAddressItem[];
  plans: {
    price: number;
    primary: boolean;
    subscription: string;
  }[];
};

const defaultValue = `
<h4>This is Heading 4</h4>
<code>This is code</code>

<pre><code class="language-javascript">for (var i=1; i &#x3C;= 20; i++) {
  if (i % 15 == 0)
    return "FizzBuzz"
  else if (i % 3 == 0)
    return "Fizz"
  else if (i % 5 == 0)
    return "Buzz"
  else
    return i
  }</code></pre>
`;

export function AccountBillingPlan({ cardList, addressBook, plans }: Props) {

  const [checked, setChecked] = useState(true);

  const [content, setContent] = useState(defaultValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const openAddress = useBoolean();

  const openCards = useBoolean();

  const primaryCard = cardList.find((card) => card.primary) || null;
  const primaryAddress = addressBook.find((address) => address.primary) || null;

  const [selectedCard, setSelectedCard] = useState<IPaymentCard | null>(primaryCard);
  const [selectedAddress, setSelectedAddress] = useState<IAddressItem | null>(primaryAddress);

  const handleSelectAddress = useCallback((newValue: IAddressItem | null) => {
    setSelectedAddress(newValue);
  }, []);

  const handleSelectCard = useCallback((newValue: IPaymentCard | null) => {
    setSelectedCard(newValue);
  }, []);



  return (
    <>
      <Card sx={{p:3}}>
        <CardHeader title="Task Details" />


        <FormControlLabel
          control={<Switch name="fullItem" checked={checked} onChange={handleChange} />}
          label="Full item"
          sx={{ mb: 3 }}
        />

        <Box
          sx={{
            rowGap: 5,
            columnGap: 3,
            display: 'grid',
            alignItems: 'flex-start',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', lg: 'repeat(1, 1fr)' },
          }}
        >
          <Editor
            fullItem={checked}
            value={content}
            onChange={(value) => setContent(value)}
            sx={{ maxHeight: 720 }}
          />

          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              overflowX: 'auto',
              bgcolor: 'background.neutral',
            }}
          >
            <Typography variant="h6">Preview</Typography>
            <Markdown children={content} />
          </Box>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box
          sx={{
            p: 3,
            gap: 1.5,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button variant="outlined">Cancel plan</Button>
          <Button variant="contained">Upgrade plan</Button>
        </Box>
      </Card>

      <PaymentCardListDialog
        list={cardList}
        open={openCards.value}
        onClose={openCards.onFalse}
        selected={(selectedId: string) => selectedCard?.id === selectedId}
        onSelect={handleSelectCard}
      />

      <AddressListDialog
        list={addressBook}
        open={openAddress.value}
        onClose={openAddress.onFalse}
        selected={(selectedId: string) => selectedAddress?.id === selectedId}
        onSelect={handleSelectAddress}
        action={
          <Button
            size="small"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ alignSelf: 'flex-end' }}
          >
            New
          </Button>
        }
      />
    </>
  );
}
