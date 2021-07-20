import React from 'react';
import { BTable } from 'bcomponents';

const columns = [{
  title: 'Option Id',
  dataIndex: 'OptionId',
  key: 'OptionId',
}, {
  title: 'Date',
  dataIndex: 'Date',
  key: 'Date',
}, {
  title: 'Status',
  dataIndex: 'Status',
  key: 'Status',
}, {
  title: 'Underlying',
  dataIndex: 'Underlying',
  key: 'Underlying',
}, {
  title: 'Type',
  dataIndex: 'Type',
  key: 'Type',
}, {
  title: 'Amount',
  dataIndex: 'Amount',
  key: 'Amount',
}, {
  title: 'Usd Value',
  dataIndex: 'UsdValue',
  key: 'UsdValue',
}, {
  title: 'Strike Price',
  dataIndex: 'StrikePrice',
  key: 'StrikePrice',
}, {
  title: 'Premium',
  dataIndex: 'Premium',
  key: 'Premium',
}, {
  title: 'PL',
  dataIndex: 'PL',
  key: 'PL',
}]


@BTable.tableEffectHoc({
  url: '/api/table/listOptionItem',
  columns: columns
})
class BasicTable extends React.Component {

  render() {
    return (
      <div style={{marginBottom: '20px'}}>
        Options Trades
      </div>
    );
  }
}

export default BasicTable;
