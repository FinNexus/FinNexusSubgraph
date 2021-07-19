import React, { Component } from 'react';
import { Avatar, Dropdown, Menu, Icon, Select } from 'antd';
import { connect } from 'dva';
import intl from 'react-intl-universal';
import styles from './baseLayout.less';

const Option = Select.Option;

@connect(({user}) => {
  return {
    user: user.user
  }
})
class Header extends Component {

  constructor() {
    super();
    this.state = {

    }
  }

  /**
   * 退出登录
   */
  logout = () => {
    this.props.dispatch({
      type: 'user/logout',
    })
  }

  /**
   * 切换语言
   */
  onLocaleChange = (value) => {
    this.props.dispatch({
      type: 'global/changeLocale',
      payload: value,
    })
  }

  render() {
    const {currLocale, user} = this.props;
    const menu =  (
      <Menu>
        <Menu.Item>
          <span onClick={this.logout}>
            <Icon type='logout' theme='outlined' />
            <span style={{ marginLeft: '10px' }}>{intl.get('user.logout')}</span>
          </span>
        </Menu.Item>
      </Menu>
    );
    return (
      <div className={styles.header}>

      </div>
    )
  }
}


export default Header;
