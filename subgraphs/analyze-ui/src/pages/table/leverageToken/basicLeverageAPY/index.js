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
  title: 'Apy',
  dataIndex: 'Apy',
  key: 'Apy',

}]


@BTable.tableEffectHoc({
  url: '/api/table/listLeverageApy',
  columns: columns
})
class BasicTable extends React.Component {

  render() {
    return (
      <div style={{marginBottom: '20px'}}>
        Leverage Token APY
      </div>
    );
  }
}

export default BasicTable;
