import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import Image from 'next/image'; // Import Next.js Image component

interface CryptoRate {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  changePercent24Hr: string;
  imageUrl: string; // Added imageUrl
}

interface CryptoRatesTableProps {
  initialCryptoRates: CryptoRate[];
}

const CryptoRatesTable: React.FC<CryptoRatesTableProps> = ({ initialCryptoRates }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [cryptoRates, setCryptoRates] = React.useState<CryptoRate[]>(initialCryptoRates);

  React.useEffect(() => {
    setCryptoRates(
      initialCryptoRates.filter(
        (rate) =>
          rate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rate.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, initialCryptoRates]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crypto Rates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Price (USD)</TableHead>
              <TableHead>24h Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cryptoRates.map((rate) => (
              <TableRow key={rate.id}>
                <TableCell className="flex items-center">
                  {rate.imageUrl && (
                    <Image
                      src={rate.imageUrl}
                      alt={`${rate.name} icon`}
                      width={20}
                      height={20}
                      className="mr-2 rounded-full"
                    />
                  )}
                  {rate.name}
                </TableCell>
                <TableCell>{rate.symbol}</TableCell>
                <TableCell>${parseFloat(rate.priceUsd).toFixed(2)}</TableCell>
                <TableCell
                  className={
                    parseFloat(rate.changePercent24Hr) >= 0 ? 'text-green-500' : 'text-red-500'
                  }
                >
                  {parseFloat(rate.changePercent24Hr).toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CryptoRatesTable;