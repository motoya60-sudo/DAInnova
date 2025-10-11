import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Sidebar.css";

const  Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      {/* 上部メニュー */}
      <div className="menu">
        <button onClick={() => navigate("/")}>トップページ</button>
        <button onClick={() => navigate("/login")}>ログイン</button>
        <button onClick={() => navigate("/external-archive")}>外部アーカイブ</button>
        <button onClick={() => navigate("/map3d")}>3Dマップ</button>
        <button onClick={() => navigate("/manage")}>管理</button>
        <button onClick={() => navigate("/create")}>作成</button>
      </div>

      {/* 下部 Actor 情報 */}
      <div className="actor">
        <div className="actor-icon">👤</div>
        <div className="actor-info">
          <p className="actor-name">ユーザー名</p>
          <p className="actor-email">user@example.com</p>
        </div>
      </div>
    </div>
  );
};
export default Sidebar
