export default function FooterScenery() {
  return (
    <div className="w-full overflow-hidden leading-none pointer-events-none select-none h-28 sm:h-36 md:h-48" aria-hidden="true">
      <svg
        viewBox="0 0 1440 220"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax slice"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b8ddf0" />
            <stop offset="60%" stopColor="#c9e8f5" />
            <stop offset="100%" stopColor="#d8eef5" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width="1440" height="220" fill="url(#skyGrad)" />

        {/* Mountains — far layer */}
        <path
          d="M0 145 Q80 108 160 125 Q240 92 320 112 Q400 82 480 102 Q560 72 640 92 Q720 62 800 84 Q880 70 960 90 Q1040 65 1120 86 Q1200 74 1280 94 Q1360 80 1440 96 L1440 220 L0 220 Z"
          fill="#9ab5cc"
          opacity="0.5"
        />
        {/* Mountains — near layer */}
        <path
          d="M0 162 Q100 130 200 148 Q300 120 400 142 Q500 112 600 134 Q660 120 720 132 Q780 118 860 136 Q960 112 1060 138 Q1160 120 1260 142 Q1360 128 1440 144 L1440 220 L0 220 Z"
          fill="#7b9db8"
          opacity="0.7"
        />

        {/* Treeline — back row */}
        <path
          d="M0 180 Q30 168 60 173 Q90 162 120 169 Q150 160 180 167 Q210 160 240 167 Q270 157 300 165 Q330 159 360 166 Q390 156 420 164 Q450 158 480 165 Q510 156 540 164 Q570 157 600 165 Q630 156 660 164 Q690 158 720 165 Q750 157 780 165 Q810 156 840 164 Q870 158 900 165 Q930 158 960 166 Q990 159 1020 167 Q1050 160 1080 168 Q1110 162 1140 170 Q1170 164 1200 172 Q1230 166 1260 174 Q1290 168 1320 176 Q1360 170 1440 177 L1440 220 L0 220 Z"
          fill="#2a5c1e"
          opacity="0.85"
        />
        {/* Treeline — front row */}
        <path
          d="M0 190 Q40 178 80 184 Q120 174 160 182 Q200 175 240 183 Q280 175 320 183 Q360 176 400 184 Q440 176 480 185 Q520 177 560 185 Q600 178 640 186 Q680 178 720 186 Q760 179 800 187 Q840 179 880 187 Q920 179 960 188 Q1000 180 1040 188 Q1080 181 1120 189 Q1160 182 1200 190 Q1240 183 1280 191 Q1320 184 1360 192 Q1400 186 1440 193 L1440 220 L0 220 Z"
          fill="#346b25"
          opacity="0.95"
        />

        {/* Ground strip */}
        <rect x="0" y="200" width="1440" height="20" fill="#ddd8c8" />

        {/* ── PALMS ── */}

        {/* Far-left small palm (background) */}
        <g opacity="0.7">
          <path d="M90 198 Q92 172 90 148" stroke="#7a5520" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M90 148 Q74 132 58 138 Q76 136 90 148 Z" fill="#2d6e1f" />
          <path d="M90 148 Q80 124 72 116 Q84 130 90 148 Z" fill="#265c1a" />
          <path d="M90 148 Q90 120 89 110 Q92 124 90 148 Z" fill="#2d6e1f" />
          <path d="M90 148 Q102 124 110 116 Q96 130 90 148 Z" fill="#265c1a" />
          <path d="M90 148 Q106 132 122 138 Q106 136 90 148 Z" fill="#2d6e1f" />
          <path d="M90 148 Q74 132 58 138" stroke="#3d8a2a" strokeWidth="1" fill="none" />
          <path d="M90 148 Q80 124 72 116" stroke="#3d8a2a" strokeWidth="1" fill="none" />
          <path d="M90 148 Q90 120 89 110" stroke="#3d8a2a" strokeWidth="1" fill="none" />
          <path d="M90 148 Q102 124 110 116" stroke="#3d8a2a" strokeWidth="1" fill="none" />
          <path d="M90 148 Q106 132 122 138" stroke="#3d8a2a" strokeWidth="1" fill="none" />
        </g>

        {/* Left tall palm */}
        <path d="M310 200 Q312 165 310 122 Q311 88 309 52" stroke="#8B5e18" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M311 178 Q305 176 311 172" stroke="#6b4a10" strokeWidth="2.5" fill="none" />
        <path d="M310 158 Q304 156 310 152" stroke="#6b4a10" strokeWidth="2.5" fill="none" />
        <path d="M310 135 Q304 133 310 129" stroke="#6b4a10" strokeWidth="2.5" fill="none" />
        <path d="M310 110 Q304 108 310 104" stroke="#6b4a10" strokeWidth="2.5" fill="none" />
        <path d="M309 86 Q303 84 309 80" stroke="#6b4a10" strokeWidth="2" fill="none" />
        {/* fronds */}
        <path d="M309 52 Q270 36 238 52 Q268 48 309 52 Z" fill="#265c1a" />
        <path d="M309 52 Q278 20 264 8 Q290 32 309 52 Z" fill="#2d6e1f" />
        <path d="M309 52 Q296 16 290 4 Q306 28 309 52 Z" fill="#265c1a" />
        <path d="M309 52 Q308 14 306 4 Q310 20 309 52 Z" fill="#2d6e1f" />
        <path d="M309 52 Q322 14 328 4 Q314 24 309 52 Z" fill="#265c1a" />
        <path d="M309 52 Q328 18 342 8 Q320 30 309 52 Z" fill="#2d6e1f" />
        <path d="M309 52 Q344 30 370 40 Q338 38 309 52 Z" fill="#265c1a" />
        <path d="M309 52 Q284 42 260 54 Q284 48 309 52 Z" fill="#3d8a2a" opacity="0.8" />
        <path d="M309 52 Q334 42 356 52 Q332 48 309 52 Z" fill="#3d8a2a" opacity="0.8" />
        <path d="M309 52 Q270 36 238 52" stroke="#4aaa30" strokeWidth="1.5" fill="none" />
        <path d="M309 52 Q278 20 264 8" stroke="#4aaa30" strokeWidth="1.5" fill="none" />
        <path d="M309 52 Q296 16 290 4" stroke="#4aaa30" strokeWidth="1.5" fill="none" />
        <path d="M309 52 Q308 14 306 4" stroke="#4aaa30" strokeWidth="1.5" fill="none" />
        <path d="M309 52 Q322 14 328 4" stroke="#4aaa30" strokeWidth="1.5" fill="none" />
        <path d="M309 52 Q328 18 342 8" stroke="#4aaa30" strokeWidth="1.5" fill="none" />
        <path d="M309 52 Q344 30 370 40" stroke="#4aaa30" strokeWidth="1.5" fill="none" />
        <circle cx="310" cy="58" r="4.5" fill="#c47c0a" />
        <circle cx="303" cy="64" r="4" fill="#b06808" />
        <circle cx="317" cy="63" r="4" fill="#c47c0a" />
        <circle cx="309" cy="70" r="3.5" fill="#d4870b" />

        {/* CENTER dominant tall palm */}
        <path d="M720 202 Q722 162 720 115 Q721 74 719 28" stroke="#7a5010" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M722 182 Q714 179 722 175" stroke="#5e3e0c" strokeWidth="3" fill="none" />
        <path d="M721 160 Q713 157 721 153" stroke="#5e3e0c" strokeWidth="3" fill="none" />
        <path d="M720 136 Q712 133 720 129" stroke="#5e3e0c" strokeWidth="3" fill="none" />
        <path d="M720 110 Q712 107 720 103" stroke="#5e3e0c" strokeWidth="3" fill="none" />
        <path d="M720 84 Q712 81 720 77" stroke="#5e3e0c" strokeWidth="2.5" fill="none" />
        <path d="M719 58 Q711 55 719 51" stroke="#5e3e0c" strokeWidth="2.5" fill="none" />
        {/* fronds — full crown */}
        <path d="M719 28 Q672 10 638 24 Q672 18 719 28 Z" fill="#235818" />
        <path d="M719 28 Q684 -8 668 -22 Q696 4 719 28 Z" fill="#2a6e1e" />
        <path d="M719 28 Q700 -16 692 -32 Q712 -4 719 28 Z" fill="#235818" />
        <path d="M719 28 Q716 -18 713 -36 Q720 -8 719 28 Z" fill="#2a6e1e" />
        <path d="M719 28 Q722 -18 726 -36 Q720 -8 719 28 Z" fill="#235818" />
        <path d="M719 28 Q738 -16 748 -32 Q728 -4 719 28 Z" fill="#2a6e1e" />
        <path d="M719 28 Q750 -6 768 -18 Q742 6 719 28 Z" fill="#235818" />
        <path d="M719 28 Q762 12 796 22 Q762 18 719 28 Z" fill="#2a6e1e" />
        <path d="M719 28 Q690 16 666 28 Q692 22 719 28 Z" fill="#3d8a2a" opacity="0.8" />
        <path d="M719 28 Q748 16 772 26 Q746 22 719 28 Z" fill="#3d8a2a" opacity="0.8" />
        <path d="M719 28 Q672 10 638 24" stroke="#52b028" strokeWidth="2" fill="none" />
        <path d="M719 28 Q684 -8 668 -22" stroke="#52b028" strokeWidth="2" fill="none" />
        <path d="M719 28 Q700 -16 692 -32" stroke="#52b028" strokeWidth="2" fill="none" />
        <path d="M719 28 Q716 -18 713 -36" stroke="#52b028" strokeWidth="2" fill="none" />
        <path d="M719 28 Q722 -18 726 -36" stroke="#52b028" strokeWidth="2" fill="none" />
        <path d="M719 28 Q738 -16 748 -32" stroke="#52b028" strokeWidth="2" fill="none" />
        <path d="M719 28 Q750 -6 768 -18" stroke="#52b028" strokeWidth="2" fill="none" />
        <path d="M719 28 Q762 12 796 22" stroke="#52b028" strokeWidth="2" fill="none" />
        <circle cx="720" cy="36" r="6" fill="#c47c0a" />
        <circle cx="711" cy="43" r="5" fill="#b06808" />
        <circle cx="729" cy="42" r="5" fill="#c47c0a" />
        <circle cx="719" cy="50" r="4.5" fill="#d4870b" />
        <circle cx="710" cy="53" r="3.5" fill="#b06808" />
        <circle cx="728" cy="52" r="3.5" fill="#c47c0a" />

        {/* Right tall palm */}
        <path d="M1130 200 Q1128 165 1130 122 Q1129 88 1131 52" stroke="#8B5e18" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M1129 178 Q1135 176 1129 172" stroke="#6b4a10" strokeWidth="2.5" fill="none" />
        <path d="M1130 158 Q1136 156 1130 152" stroke="#6b4a10" strokeWidth="2.5" fill="none" />
        <path d="M1130 135 Q1136 133 1130 129" stroke="#6b4a10" strokeWidth="2.5" fill="none" />
        <path d="M1130 110 Q1136 108 1130 104" stroke="#6b4a10" strokeWidth="2.5" fill="none" />
        <path d="M1131 86 Q1137 84 1131 80" stroke="#6b4a10" strokeWidth="2" fill="none" />
        <path d="M1131 52 Q1170 36 1202 52 Q1172 48 1131 52 Z" fill="#265c1a" />
        <path d="M1131 52 Q1162 20 1176 8 Q1150 32 1131 52 Z" fill="#2d6e1f" />
        <path d="M1131 52 Q1144 16 1150 4 Q1134 28 1131 52 Z" fill="#265c1a" />
        <path d="M1131 52 Q1132 14 1134 4 Q1130 20 1131 52 Z" fill="#2d6e1f" />
        <path d="M1131 52 Q1118 14 1112 4 Q1126 24 1131 52 Z" fill="#265c1a" />
        <path d="M1131 52 Q1112 18 1098 8 Q1120 30 1131 52 Z" fill="#2d6e1f" />
        <path d="M1131 52 Q1096 30 1070 40 Q1102 38 1131 52 Z" fill="#265c1a" />
        <path d="M1131 52 Q1156 42 1180 52 Q1156 48 1131 52 Z" fill="#3d8a2a" opacity="0.8" />
        <path d="M1131 52 Q1106 42 1084 52 Q1108 48 1131 52 Z" fill="#3d8a2a" opacity="0.8" />
        <path d="M1131 52 Q1170 36 1202 52" stroke="#4aaa30" strokeWidth="1.5" fill="none" />
        <path d="M1131 52 Q1162 20 1176 8" stroke="#4aaa30" strokeWidth="1.5" fill="none" />
        <path d="M1131 52 Q1144 16 1150 4" stroke="#4aaa30" strokeWidth="1.5" fill="none" />
        <path d="M1131 52 Q1132 14 1134 4" stroke="#4aaa30" strokeWidth="1.5" fill="none" />
        <path d="M1131 52 Q1118 14 1112 4" stroke="#4aaa30" strokeWidth="1.5" fill="none" />
        <path d="M1131 52 Q1112 18 1098 8" stroke="#4aaa30" strokeWidth="1.5" fill="none" />
        <path d="M1131 52 Q1096 30 1070 40" stroke="#4aaa30" strokeWidth="1.5" fill="none" />
        <circle cx="1130" cy="58" r="4.5" fill="#c47c0a" />
        <circle cx="1137" cy="64" r="4" fill="#b06808" />
        <circle cx="1123" cy="63" r="4" fill="#c47c0a" />
        <circle cx="1131" cy="70" r="3.5" fill="#d4870b" />

        {/* Far-right small palm */}
        <g opacity="0.7">
          <path d="M1350 198 Q1348 172 1350 148" stroke="#7a5520" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M1350 148 Q1334 132 1318 138 Q1336 136 1350 148 Z" fill="#2d6e1f" />
          <path d="M1350 148 Q1340 124 1332 116 Q1344 130 1350 148 Z" fill="#265c1a" />
          <path d="M1350 148 Q1350 120 1351 110 Q1348 124 1350 148 Z" fill="#2d6e1f" />
          <path d="M1350 148 Q1362 124 1370 116 Q1356 130 1350 148 Z" fill="#265c1a" />
          <path d="M1350 148 Q1366 132 1382 138 Q1366 136 1350 148 Z" fill="#2d6e1f" />
          <path d="M1350 148 Q1334 132 1318 138" stroke="#3d8a2a" strokeWidth="1" fill="none" />
          <path d="M1350 148 Q1340 124 1332 116" stroke="#3d8a2a" strokeWidth="1" fill="none" />
          <path d="M1350 148 Q1350 120 1351 110" stroke="#3d8a2a" strokeWidth="1" fill="none" />
          <path d="M1350 148 Q1362 124 1370 116" stroke="#3d8a2a" strokeWidth="1" fill="none" />
          <path d="M1350 148 Q1366 132 1382 138" stroke="#3d8a2a" strokeWidth="1" fill="none" />
        </g>
      </svg>
    </div>
  );
}
