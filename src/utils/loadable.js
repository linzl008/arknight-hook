import React from "react";
import Loadable from "react-loadable";
import { Spin } from "antd";

const loading = {
  display: "flex",
  width: "100wh",
  height: "100vh",
  justifyContent: "center",
  alignItems: "center"
};
//通用的过场组件
const loadingComponent = ({ error, pastDelay }) => {
  if (error) {
    return <div style={loading}>加载失败!</div>;
  } else if (pastDelay) {
    return (
      <div style={loading}>
        <Spin tip="加载中" />
      </div>
    );
  } else {
    return null;
  }
};

//过场组件默认采用通用的，若传入了loading，则采用传入的过场组件 delay 避免加载组件时的闪烁 小于该值不显示过场组件
export default (loader, loading = loadingComponent) => {
  return Loadable({
    loader,
    loading,
    delay: 300
  });
};
