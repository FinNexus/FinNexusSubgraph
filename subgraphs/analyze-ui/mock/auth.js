
const responseJson = (data) => {
  return {
    code: 0,
    data
  }
}
const adminMenu = [
  {
    id: 1,
    name: 'Leverage Token',
    enName: 'Table',
    icon: 'table',
    url: '/table',
    children: [{
      id: 11,
      name: 'TVL',
      enName: 'Basic Table',
      url: '/table/leverageToken/basicLeverageTVL',
    }, {
      id: 12,
      name: 'APY',
      enName: 'Basic Table',
      url: '/table/leverageToken/basicLeverageAPY',
    },{
      id: 13,
      name: 'TRADE VOL',
      enName: 'Basic Table',
      url: '/table/leverageToken/basicLeverageTradeVol',
    },{
      id: 14,
      name: 'Fees',
      enName: 'Basic Table',
      url: '/table/leverageToken/basicLeverageFee',
    },{
      id: 15,
      name: 'Trade Item',
      enName: 'Basic Table',
      url: '/table/leverageToken/basicLeverageTradeItem',
    }],
  },
  {
    id: 2,
    name: 'Pheonix Options',
    enName: 'Table',
    icon: 'table',
    url: '/table',
    children: [{
      id: 21,
      name: 'TVL',
      enName: 'Basic Table',
      url: '/table/options/basicOptionTVL',
    }, {
      id: 22,
      name: 'Pool Networth',
      enName: 'Basic Table',
      url: '/table/options/basicOptionPoolNetworth',
    },{
      id: 23,
      name: 'Active Option Volume',
      enName: 'Basic Table',
      url: '/table/options/basicOptionActiveVol',
    },{
      id: 25,
      name: 'Premium',
      enName: 'Basic Table',
      url: '/table/options/basicOptionPremium',
    },{
      id: 26,
      name: 'Fees',
      enName: 'Basic Table',
      url: '/table/options/basicOptionFee',
    },{
      id: 27,
      name: 'Option Item',
      enName: 'Basic Table',
      url: '/table/options/basicOptionsItem',
    }],
  }
];


const userMenu = [
  {
    id: 1,
    name: '概览',
    enName: 'Dashboard',
    icon: 'dashboard',
    url: '/dashboard',
  },
  {
    id: 2,
    name: '列表',
    enName: 'Table',
    icon: 'table',
    url: '/table',
    children: [{
      id: 21,
      name: '基础列表',
      enName: 'Basic Table',
      url: '/table/basic',
    }, {
      id: 22,
      name: '基础列表2',
      enName: 'Basic Table',
      url: '/table/basic/basic2',
    }, {
      id: 23,
      name: '大列表',
      enName: 'Big Table',
      url: '/table/big',
    }],
  },
  {
    id: 3,
    name: '图表',
    enName: 'chart',
    icon: 'bar-chart',
    url: '/chart',
  },
];

export default {
  // 支持值为 Object 和 Array
  'GET /api/menu/:usreName': (req, res) => {
    setTimeout(() => {
      // console.log(req);
      const {usreName} = req.params;
      const menu = adminMenu;
      res.send(responseJson(menu));
    }, 300);
  },
  // GET POST 可省略
  '/api/users/1': { id: 1 },

  // 支持自定义函数，API 参考 express@4
  'POST /api/users/create': (req, res) => { res.end('OK'); },
};
