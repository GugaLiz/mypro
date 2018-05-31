import React, { PureComponent, Fragment } from 'react';
import { render } from 'react-dom';

import { connect } from 'dva';
import { Row, Col, Card, Tooltip, Menu, Dropdown, Icon, Button, Layout } from 'antd';
import numeral from 'numeral';
import { Pie, WaterWave, Gauge, TagCloud } from 'components/Charts';
//import Map from 'components/Map';
import CountDown from 'components/CountDown';
import ActiveChart from 'components/ActiveChart';
import Authorized from '../../utils/Authorized';
import styles from './Map.less';

import { Map, TileLayer, Marker } from 'react-leaflet';
import MakerClusterGroup from 'react-leaflet-markercluster';

import 'leaflet/dist/leaflet.css';

const { Secured } = Authorized;
const { Content } = Layout;
const targetTime = new Date().getTime() + 3900000;

// use permission as a parameter
const havePermissionAsync = new Promise(resolve => {
  // Call resolve on behalf of passed
  setTimeout(() => resolve(), 1000);
});
@Secured(havePermissionAsync)
@connect(({ site, loading }) => ({
  site,
  loading: loading.models.site,
}))
export default class SiteMap extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'site/fetch',
    });
  }

  render() {
    const { site: { list }, loading } = this.props;
    //const{ loading } = this.props
    //console.log({list});

    const position = [22.7047, 113.302];
    const dataList = { list }.list.list;
    //console.log(dataList);
    let cellPoints = [];

    dataList.map(item => {
      let lng = Number.parseFloat(item.Lng);
      let lat = Number.parseFloat(item.Lat);
      cellPoints.push([lng, lat]);
    });

    //console.log(cellPoints);

    const style = {
      width: '100%',
      height: '600px',
    };
    const SubMenu = Menu.SubMenu;
    const menu = (
      <Menu>
        <Menu.Item>1st menu item</Menu.Item>
        <Menu.Item>2nd menu item</Menu.Item>
        <SubMenu title="sub menu">
          <Menu.Item>3rd menu item</Menu.Item>
          <Menu.Item>4th menu item</Menu.Item>
        </SubMenu>
        <SubMenu title="disabled sub menu" disabled>
          <Menu.Item>5d menu item</Menu.Item>
          <Menu.Item>6th menu item</Menu.Item>
        </SubMenu>
      </Menu>
    );
    const style1 = {
      margin: '10px 0 0 50px',
      position: 'absolute',
      zIndex: 19999,
    };
    return (
      <Content>
        <div className="ant-card-bordered" style={style}>
          <div style={style1}>
            <Button.Group>
              <Tooltip title="测量">
                <Button size="small">
                  <Icon type="share-alt" />
                </Button>
              </Tooltip>

              <Tooltip title="放大">
                <Button size="small">
                  <Icon type="search" />
                </Button>
              </Tooltip>

              <Tooltip title="定位">
                <Button size="small">
                  <Icon type="pushpin" />
                </Button>
              </Tooltip>

              <Dropdown overlay={menu}>
                <Tooltip title="切换底图">
                  <Button size="small">
                    <Icon type="switcher" />
                  </Button>
                </Tooltip>
              </Dropdown>
            </Button.Group>
          </div>
          <Map
            className="markercluster-map"
            center={position}
            zoom={13}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker position={position} />
          </Map>
        </div>
      </Content>
    );
  }
}
