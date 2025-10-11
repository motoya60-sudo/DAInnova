import React, { useEffect, useMemo, useState } from "react";
import "../css/ArchiveManager.css";

import { TAGS } from "../mockData/TagsMack";
import { IMAGES } from "../mockData/ImagesMack";
import { IMAGE_TAGS } from "../mockData/ImageTagsMack";

// ============== Helpers ==============
const tagNameById = new Map(TAGS.map((t) => [t.id, t.name]));
const tagIdByName = new Map(TAGS.map((t) => [t.name, t.id]));

/** 各画像に tags: ["car", ...] を付与した配列を返す */
function getImagesWithTags() {
  const map = new Map(); // image_id -> [tagName,...]
  for (const { image_id, tag_id } of IMAGE_TAGS) {
    const name = tagNameById.get(tag_id);
    if (!name) continue;
    if (!map.has(image_id)) map.set(image_id, []);
    map.get(image_id).push(name);
  }
  return IMAGES.map((img) => ({ ...img, tags: map.get(img.id) ?? [] }));
}

/** タグ検索（AND/OR）＆ municipality / limit */
function searchImagesByTags(tagNames, { mode = "OR", municipality, limit = 40 } = {}) {
  const wantedIds = tagNames.map((n) => tagIdByName.get(n)).filter(Boolean);

  // 画像ごとのタグIDセット
  const imgToTagIds = new Map();
  for (const { image_id, tag_id } of IMAGE_TAGS) {
    if (!imgToTagIds.has(image_id)) imgToTagIds.set(image_id, new Set());
    imgToTagIds.get(image_id).add(tag_id);
  }

  const hits = IMAGES.filter((img) => {
    if (municipality && img.municipality !== municipality) return false;
    if (wantedIds.length === 0) return true;
    const set = imgToTagIds.get(img.id) ?? new Set();
    return mode === "AND"
      ? wantedIds.every((id) => set.has(id))
      : wantedIds.some((id) => set.has(id));
  });

  const withTags = getImagesWithTags();
  const tagMap = new Map(withTags.map((x) => [x.id, x.tags]));
  const sliced = hits.slice(0, limit);

  return sliced.map((img) => ({ ...img, tags: tagMap.get(img.id) ?? [] }));
}

// ============== Component ==============
const ArchiveManager = () => {
  const [all, setAll] = useState([]);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(new Map());

  // UI State
  const [tagInput, setTagInput] = useState(""); // "car, person"
  const [mode, setMode] = useState("OR"); // 'AND'|'OR'
  const [municipality, setMunicipality] = useState("");
  const [limit, setLimit] = useState(40);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getImagesWithTags();
    setAll(data);
    setResults(data.slice(0, limit));
    setLoading(false);
  }, [limit]);

  const tagList = useMemo(
    () =>
      tagInput
        .split(/[,\s]+/)
        .map((s) => s.trim())
        .filter(Boolean),
    [tagInput]
  );

  const handleSearch = () => {
    setLoading(true);
    const items = searchImagesByTags(tagList, {
      mode,
      municipality: municipality || undefined,
      limit,
    });
    setResults(items);
    setLoading(false);
  };

  const reset = () => {
    setTagInput("");
    setMunicipality("");
    setMode("OR");
    setResults(all.slice(0, limit));
  };

  const toggleSelect = (img) => {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(img.id)) next.delete(img.id);
      else next.set(img.id, img);
      return next;
    });
  };

  const clearSelection = () => setSelected(new Map());

  return (
    <div className="archive-root">
      {/* 上部ツールバー */}
      <div className="archive-toolbar">
        <div className="filter-row">
          <label>Tags</label>
          <input
            className="input"
            placeholder="car, person, bridge..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
          />
          <select className="select" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="OR">OR</option>
            <option value="AND">AND</option>
          </select>
        </div>

        <div className="filter-row">
          <label>Municipality</label>
          <input
            className="input"
            placeholder="例: 熊本市中央区"
            value={municipality}
            onChange={(e) => setMunicipality(e.target.value)}
          />
          <label>Limit</label>
          <input
            className="input input-num"
            type="number"
            min={1}
            max={500}
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value || "1", 10))}
          />
          <button className="btn" onClick={handleSearch}>
            検索
          </button>
          <button className="btn btn-ghost" onClick={reset}>
            リセット
          </button>
        </div>
      </div>

      {/* 画像グリッド */}
      <div className="archive-grid">
        {loading ? (
          <div className="info">Loading...</div>
        ) : results.length === 0 ? (
          <div className="info">該当なし</div>
        ) : (
          results.map((img) => {
            const checked = selected.has(img.id);
            return (
              <div
                key={img.id}
                className={`card ${checked ? "card-selected" : ""}`}
                onClick={() => toggleSelect(img)}
              >
                <div className="thumb-wrap">
                  <img src={img.file_path} alt="" className="thumb" />
                  <input type="checkbox" readOnly checked={checked} className="check" />
                </div>
                <div className="meta">
                  <div className="path">{img.file_path}</div>
                  <div className="row-between">
                    <span className="badge">{img.municipality}</span>
                    <div className="tags">
                      {img.tags?.map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="row-between small">
                    <span>uploaded: {new Date(img.uploaded_at).toLocaleString()}</span>
                    <span className={img.is_secondary_use_ok ? "ok" : "ng"}>
                      {img.is_secondary_use_ok ? "2次利用OK" : "2次利用NG"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ▼ 下部：選択ギャラリー（横スクロール） */}
      <div className="gallery-box">
        <div className="gallery-header">
          <span>選択ギャラリー</span>
          <div className="gallery-actions">
            <span className="count">{selected.size} 枚</span>
            <button className="btn btn-ghost" onClick={clearSelection}>
              クリア
            </button>
            <button
              className="btn btn-primary"
              onClick={() => alert("（例）この選択を新規ギャラリーとして保存")}
            >
              保存
            </button>
          </div>
        </div>

        {selected.size === 0 ? (
          <div className="gallery-empty">画像をクリックして選択するとここに表示されます</div>
        ) : (
          <div className="gallery-scroller">
            {[...selected.values()].map((img) => (
              <div key={img.id} className="gallery-item">
                <img src={img.file_path} alt="" className="gallery-thumb" />
                <button className="btn-mini" onClick={() => toggleSelect(img)}>
                  解除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchiveManager;
