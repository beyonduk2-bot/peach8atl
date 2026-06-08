export function StadiumWalkMiniMap() {
  return (
    <section className="rounded-[1.45rem] border border-white/10 bg-[#161b27] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.78rem] font-bold tracking-[0.03em] text-[#ffb347]">Stadium walk</p>
          <h2 className="mt-1 text-lg font-bold leading-tight text-[#f0f6fc]">The last few minutes on foot</h2>
        </div>
        <span className="shrink-0 rounded-full bg-[#211c16] px-3 py-1.5 text-xs font-black text-[#ffb347]">
          mini map
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-[1.35rem] bg-[#fff3dd] p-3 text-[#172033]">
        <svg className="h-auto w-full" viewBox="0 0 360 220" role="img" aria-label="Simple walking map from SEC District and Vine City to the stadium area">
          <rect width="360" height="220" rx="24" fill="#fff3dd" />
          <g opacity="0.5" stroke="#d8cdb8" strokeWidth="8">
            <path d="M0 52H360M0 120H360M0 182H360" />
            <path d="M70 0V220M180 0V220M292 0V220" />
          </g>
          <g opacity="0.45">
            <rect x="84" y="20" width="72" height="46" rx="10" fill="#d9e7b7" />
            <rect x="218" y="22" width="74" height="52" rx="12" fill="#efd0aa" />
            <rect x="45" y="145" width="70" height="44" rx="12" fill="#d9e7b7" />
            <rect x="250" y="148" width="66" height="42" rx="12" fill="#d9e7b7" />
          </g>

          <path d="M62 110C96 112 122 130 136 158C146 178 161 185 180 178" fill="none" stroke="#4a79d8" strokeDasharray="4 8" strokeLinecap="round" strokeWidth="5" />
          <path d="M298 104C266 118 240 144 219 162C205 174 193 179 180 178" fill="none" stroke="#4a79d8" strokeDasharray="4 8" strokeLinecap="round" strokeWidth="5" />

          <g>
            <ellipse cx="180" cy="170" fill="#e9ecef" rx="52" ry="31" stroke="#c9ced6" strokeWidth="2" />
            <path d="M140 163L166 140H196L221 163L203 193H158Z" fill="#cbd2d9" opacity="0.8" />
            <circle cx="180" cy="166" fill="#ffffff" r="17" />
            <path d="M180 155C173 155 170 160 170 165C170 173 180 181 180 181C180 181 190 173 190 165C190 160 187 155 180 155Z" fill="#ff4d4d" />
            <circle cx="180" cy="165" fill="#ffffff" r="3.5" />
            <text x="180" y="213" textAnchor="middle" fontSize="16" fontWeight="900" fill="#172033">
              Stadium Area
            </text>
          </g>

          <g>
            <circle cx="58" cy="108" r="17" fill="#4a79d8" stroke="#fff" strokeWidth="4" />
            <text x="58" y="114" textAnchor="middle" fontSize="15" fontWeight="900" fill="#fff">T</text>
            <text x="20" y="78" fontSize="13" fontWeight="900" fill="#172033">Vine City</text>
            <text x="20" y="94" fontSize="13" fontWeight="900" fill="#172033">Station</text>
            <rect x="18" y="125" width="92" height="42" rx="10" fill="#fff" stroke="#d7dbe2" />
            <text x="64" y="143" textAnchor="middle" fontSize="12" fontWeight="900" fill="#172033">~8 min walk</text>
            <text x="64" y="158" textAnchor="middle" fontSize="11" fontWeight="800" fill="#667085">Alternate access</text>
          </g>

          <g>
            <circle cx="300" cy="102" r="17" fill="#4a79d8" stroke="#fff" strokeWidth="4" />
            <text x="300" y="108" textAnchor="middle" fontSize="15" fontWeight="900" fill="#fff">T</text>
            <text x="248" y="72" fontSize="13" fontWeight="900" fill="#172033">SEC District</text>
            <text x="266" y="88" fontSize="13" fontWeight="900" fill="#172033">Station</text>
            <rect x="230" y="120" width="106" height="42" rx="10" fill="#fff" stroke="#d7dbe2" />
            <text x="283" y="138" textAnchor="middle" fontSize="12" fontWeight="900" fill="#172033">~6 min walk</text>
            <text x="283" y="153" textAnchor="middle" fontSize="11" fontWeight="800" fill="#667085">Main access</text>
          </g>
        </svg>
      </div>

      <p className="mt-3 rounded-2xl bg-[#0d1117] p-3 text-sm font-bold leading-5 text-[#8b949e]">
        Follow event signs and staff once you are on the ground.
      </p>
    </section>
  );
}
