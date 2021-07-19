import React from 'react';
import { BTable } from 'bcomponents';

const columns = [{
  title: 'Token Name',
  dataIndex: 'TokenName',
  key: 'TokenName',
}, {
  title: 'Date',
  dataIndex: 'Date',
  key: 'Date',
}, {
  title: 'Buy Bull Amount',
  dataIndex: 'BuyLeverAmount',
  key: 'BuyLeverAmount',
}, {
  title: 'Buy Bull Value',
  dataIndex: 'BuyLeverValue',
  key: 'BuyLeverValue',
},{
  title: 'Sell Bull Amount',
  dataIndex: 'SellLeverAmount',
  key: 'SellLeverAmount',
},{
  title: 'Sell Bull Value',
  dataIndex: 'SellLeverValue',
  key: 'SellLeverValue',
},{
  title: 'Buy Bear Amount',
  dataIndex: 'BuyHedgeAmount',
  key: 'BuyHedgeAmount',
},{
  title: 'Buy Bear Value',
  dataIndex: 'BuyHedgeValue',
  key: 'Buy Hedge Value',
},{
  title: 'Sell Bear Amount',
  dataIndex: 'SellHedgeAmount',
  key: 'SellHedgeAmount',
},{
  title: 'Sell Bear Value',
  dataIndex: 'SellHedgeValue',
  key: 'SellHedgeValue',
}]


@BTable.tableEffectHoc({
  url: '/api/table/listLeverageTradeVol',
  columns: columns
})

class BasicTable extends React.Component {
  render() {
    return (
      <div style={{marginBottom: '20px'}}>
        Leverage Token Trade Volume
      </div>
    );
  }
}

export default BasicTable;
