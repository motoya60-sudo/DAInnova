import React from "react";
import "../css/Sidebar.css";

export const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* 上部メニュー */}
      <div className="menu">
        <button>トップページ</button>
        <button>ログイン</button>
        <button>外部アーカイブ</button>
        <button>3Dマップ</button>
        <button>管理</button>
        <button>作成</button>
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
