// ============================================================
// SAIF ELITE LIVE TV – SIMPLE DIRECT PLAYER + PROXY
// ============================================================
(function () {
  function waitForDOM(cb) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', cb);
    else cb();
  }

  waitForDOM(function () {
    const zone = window.getSaifToolZone ? window.getSaifToolZone() : document.getElementById('toolsPluginZone');
    if (!zone) { console.warn('Saif TV: toolsPluginZone not found'); return; }

    // CSS ও ফন্ট
    if (!document.getElementById('vjs-tv-style')) {
      const vjsStyle = document.createElement('link');
      vjsStyle.id = 'vjs-tv-style';
      vjsStyle.rel = 'stylesheet';
      vjsStyle.href = 'https://vjs.zencdn.net/8.10.0/video-js.css';
      document.head.appendChild(vjsStyle);
    }
    if (!document.getElementById('fa-tv-style')) {
      const fa = document.createElement('link');
      fa.id = 'fa-tv-style';
      fa.rel = 'stylesheet';
      fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
      document.head.appendChild(fa);
    }

    const style = document.createElement('style');
    style.textContent = `
      .tv-container {
        background: #111115; border-radius: 24px; padding: 24px;
        border: 1px solid rgba(255, 215, 0, 0.12);
        box-shadow: 0 20px 40px rgba(0,0,0,0.7);
        max-width: 500px; width: 100%; color: #ffffff;
        box-sizing: border-box; font-family: 'Outfit', sans-serif; margin-bottom: 20px;
      }
      .tv-title {
        font-size: 0.9rem; color: #ffd700; margin: 0 0 16px 0;
        letter-spacing: 2px; text-transform: uppercase;
        display: flex; align-items: center; gap: 10px; font-weight: bold;
      }
      .player-wrapper {
        position: relative; width: 100%; border-radius: 16px; overflow: hidden;
        border: 1.5px solid rgba(255, 215, 0, 0.2);
        box-shadow: 0 10px 30px rgba(0,0,0,0.5); background: #000;
        margin-bottom: 15px; aspect-ratio: 16 / 9;
      }
      .video-js { width: 100% !important; height: 100% !important; }
      .video-js .vjs-big-play-button {
        background: linear-gradient(135deg, #ff4500, #ff8c00) !important;
        border: none !important; color: #000 !important; border-radius: 50% !important;
        width: 60px !important; height: 60px !important; line-height: 60px !important;
        margin-left: -30px !important; margin-top: -30px !important;
      }
      .search-wrapper { position: relative; margin-bottom: 15px; }
      .search-wrapper i {
        position: absolute; left: 15px; top: 50%; transform: translateY(-50%);
        color: rgba(255, 215, 0, 0.5);
      }
      .search-box {
        width: 100%; padding: 12px 16px 12px 40px; border-radius: 12px;
        border: 1px solid rgba(255, 215, 0, 0.15); background: #1a1a22;
        color: #fff; outline: none; box-sizing: border-box; font-size: 0.85rem;
      }
      .search-box:focus { border-color: #ffd700; }
      .category-tabs {
        display: flex; gap: 6px; margin-bottom: 15px; overflow-x: auto; padding-bottom: 6px;
      }
      .category-tabs::-webkit-scrollbar { height: 3px; }
      .category-tabs::-webkit-scrollbar-thumb { background: #ffd700; border-radius: 10px; }
      .tab-btn {
        padding: 8px 14px; border-radius: 20px; border: 1px solid rgba(255,215,0,0.1);
        background: rgba(255,215,0,0.02); color: #ccc; cursor: pointer;
        font-size: 0.75rem; font-weight: bold; white-space: nowrap;
        display: flex; align-items: center; gap: 5px;
      }
      .tab-btn.active {
        background: linear-gradient(135deg, #ff4500, #ff8c00); color: #000; border-color: #ff8c00;
      }
      .channel-grid {
        display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
        gap: 8px; max-height: 220px; overflow-y: auto; padding-right: 5px;
      }
      .channel-grid::-webkit-scrollbar { width: 5px; }
      .channel-grid::-webkit-scrollbar-thumb { background: #ffd700; border-radius: 10px; }
      .channel-btn {
        padding: 10px 8px; border-radius: 10px;
        border: 1.5px solid rgba(255, 215, 0, 0.1);
        background: rgba(255, 215, 0, 0.02); color: #ffffff;
        font-size: 0.75rem; font-weight: 700; cursor: pointer;
        text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .channel-btn:hover { border-color: #ffd700; background: rgba(255, 215, 0, 0.08); }
      .channel-btn.active {
        background: linear-gradient(135deg, #ff4500, #ff8c00); color: #000; border-color: #ff8c00;
      }
      .tv-status { font-size: 0.72rem; text-align: center; margin-top: 15px; opacity: 0.6; }
    `;
    document.head.appendChild(style);

    // উইজেট HTML (সরাসরি <video>)
    const tvBox = document.createElement('div');
    tvBox.className = 'tv-container';
    tvBox.innerHTML = `
      <div class="tv-title"><i class="fas fa-circle-play fa-beat" style="color: red;"></i> Saif Live TV</div>
      <div class="player-wrapper">
        <video id="saif-tv-player" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="auto"></video>
      </div>
      <div class="search-wrapper">
        <i class="fas fa-magnifying-glass"></i>
        <input type="text" id="tvSearch" class="search-box" placeholder="চ্যানেল সার্চ করুন...">
      </div>
      <div class="category-tabs" id="tvTabs">
        <button class="tab-btn active" data-cat="all"><i class="fas fa-border-all"></i> All</button>
        <button class="tab-btn" data-cat="hot"><i class="fas fa-fire" style="color:#ff4500;"></i> Hot</button>
        <button class="tab-btn" data-cat="bd"><i class="fas fa-flag"></i> BD</button>
        <button class="tab-btn" data-cat="sports"><i class="fas fa-trophy"></i> Sports</button>
        <button class="tab-btn" data-cat="news"><i class="fas fa-newspaper"></i> News</button>
        <button class="tab-btn" data-cat="ent"><i class="fas fa-film"></i> Serials</button>
        <button class="tab-btn" data-cat="islamic"><i class="fas fa-mosque"></i> Islamic</button>
        <button class="tab-btn" data-cat="kids"><i class="fas fa-child"></i> Kids</button>
      </div>
      <div class="channel-grid" id="tvChannelGrid">
        <div style="grid-column:1/-1;text-align:center;padding:20px;opacity:0.7;">
          <i class="fas fa-spinner fa-spin"></i> চ্যানেল লোড হচ্ছে...
        </div>
      </div>
      <div class="tv-status" id="tvStatusText">Ready</div>
    `;
    zone.appendChild(tvBox);

    // প্লেয়ার ইনিশিয়ালাইজ
    let playerInstance = null;
    function initPlayer() {
      if (typeof videojs === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://vjs.zencdn.net/8.10.0/video.js';
        script.onload = () => createPlayer();
        document.body.appendChild(script);
      } else {
        createPlayer();
      }
    }

    function createPlayer() {
      playerInstance = videojs('saif-tv-player', {
        fluid: true,
        autoplay: false,
        controls: true,
        html5: {
          hls: {
            // রেফারার হেডার সরিয়ে দেওয়া (সেফটির জন্য)
            xhrSetup: function(xhr) {
              xhr.setRequestHeader('Referer', '');
            }
          }
        }
      });
      loadM3U();
    }

    // 🔥 প্রক্সি ইউআরএল জেনারেটর (HTTP → HTTPS)
    function getProxyUrl(streamUrl) {
      // যদি সাইট HTTPS হয় এবং স্ট্রিম HTTP হয়, তাহলে নিজস্ব প্রক্সি ব্যবহার করো
      if (window.isSecureContext && streamUrl.startsWith('http://')) {
        return 'https://portofolio-saif.rf.gd/proxy.php?url=' + encodeURIComponent(streamUrl);
      }
      // নাহলে সরাসরি ইউআরএল (ইতিমধ্যে HTTPS বা লোকাল টেস্টিং)
      return streamUrl;
    }

    function setPlayerSource(url) {
      const finalUrl = getProxyUrl(url);
      if (playerInstance) {
        playerInstance.src({
          src: finalUrl,
          type: 'application/x-mpegURL',
          withCredentials: false
        });
        playerInstance.play().catch(err => console.log('Autoplay prevented:', err));
      }
    }

    async function loadM3U() {
      const url = 'https://raw.githubusercontent.com/tabassumtanha127t-dot/Iptv/refs/heads/main/tv.m3u';
      try {
        const res = await fetch(url);
        const text = await res.text();
        allChannels = parseM3U(text);
        filterAndRender();
      } catch (e) {
        document.getElementById('tvChannelGrid').innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#ff3333;">M3U fetch failed</div>';
      }
    }

    function parseM3U(data) {
      const lines = data.split('\n');
      const result = [];
      let name = '';
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('#EXTINF:')) {
          const comma = line.indexOf(',');
          name = comma !== -1 ? line.substring(comma + 1).trim() : 'Live Stream';
        } else if (line.startsWith('http')) {
          if (name) {
            const low = name.toLowerCase();
            let cat = 'other';
            if (low.includes('somoy') || low.includes('t sports') || low.includes('gtv') || low.includes('star sports') || low.includes('sony tv') || low.includes('cricket')) cat = 'hot';
            else if (low.includes('sports') || low.includes('football') || low.includes('ten') || low.includes('willow')) cat = 'sports';
            else if (low.includes('news') || low.includes('jamuna') || low.includes('independent') || low.includes('ekattor') || low.includes('khabor')) cat = 'news';
            else if (low.includes('islamic') || low.includes('makkah') || low.includes('madinah') || low.includes('peace tv')) cat = 'islamic';
            else if (low.includes('kids') || low.includes('cartoon') || low.includes('disney') || low.includes('nick')) cat = 'kids';
            else if (low.includes('star plus') || low.includes('zee tv') || low.includes('movies') || low.includes('cinema')) cat = 'ent';
            else if (low.includes('bangla') || low.includes('bd') || low.includes('channel i') || low.includes('atn') || low.includes('ntv')) cat = 'bd';
            result.push({ name, url: line, category: cat });
            name = '';
          }
        }
      }
      return result;
    }

    let allChannels = [];
    let currentCategory = 'all';

    function filterAndRender() {
      const term = document.getElementById('tvSearch').value.toLowerCase();
      const filtered = allChannels.filter(ch =>
        ch.name.toLowerCase().includes(term) &&
        (currentCategory === 'all' || ch.category === currentCategory)
      );
      renderGrid(filtered);
    }

    function renderGrid(channels) {
      const grid = document.getElementById('tvChannelGrid');
      const status = document.getElementById('tvStatusText');
      grid.innerHTML = '';
      if (!channels.length) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;opacity:0.6;padding:15px;">কোনো চ্যানেল নেই</div>';
        return;
      }
      channels.forEach((ch, idx) => {
        const btn = document.createElement('button');
        btn.className = 'channel-btn';
        btn.textContent = ch.name;
        btn.addEventListener('click', () => {
          document.querySelectorAll('.channel-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          setPlayerSource(ch.url);
          status.innerHTML = `Playing: <span style="color:#ffd700;font-weight:bold;">${ch.name}</span>`;
        });
        grid.appendChild(btn);
        if (idx === 0 && currentCategory === 'all' && !document.getElementById('tvSearch').value) {
          btn.classList.add('active');
          setPlayerSource(ch.url);
          status.innerHTML = `Ready: <span style="color:#ffd700;font-weight:bold;">${ch.name}</span>`;
        }
      });
    }

    document.getElementById('tvSearch').addEventListener('input', filterAndRender);
    document.querySelectorAll('.tab-btn').forEach(tab => {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.getAttribute('data-cat');
        filterAndRender();
      });
    });

    initPlayer();
  });
})();
