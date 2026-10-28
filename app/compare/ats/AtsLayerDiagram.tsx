/**
 * HireRevolution as a layer on top of the customer's ATS: jobs and candidates
 * flow up, match analysis flows back down. Navy is the customer's own system,
 * Revolution Blue what HireRevolution adds (Marketing/brand-colors.md).
 * Presentation attributes only; the CSP forbids style attributes.
 */

const NAVY = "#182F54";
const BLUE = "#2758A1";
const TINT = "#E9EFF8";
const SLATE = "#5A6472";
const FONT = "Arial, Helvetica, sans-serif";

function Chip({ x, y, w, label, fill, color }: { x: number; y: number; w: number; label: string; fill: string; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={26} rx={13} fill={fill} />
      <text x={x + w / 2} y={y + 17.5} textAnchor="middle" fontSize={13} fontWeight={600} fill={color}>
        {label}
      </text>
    </g>
  );
}

export default function AtsLayerDiagram() {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xl ring-1 ring-white/10">
      <svg viewBox="0 0 420 400" className="w-full h-auto" role="img" aria-labelledby="ats-diagram-title" fontFamily={FONT}>
        <title id="ats-diagram-title">
          HireRevolution sits on top of your ATS. Jobs and candidates come up from your ATS; match analysis goes back
          down to it. HireRevolution also adds job seekers and a wider-market search.
        </title>

        {/* More candidates, feeding into the layer */}
        <rect x={60} y={10} width={300} height={48} rx={24} fill={TINT} stroke={BLUE} strokeWidth={1.5} strokeDasharray="5 4" />
        <text x={210} y={39} textAnchor="middle" fontSize={15} fontWeight={600} fill={NAVY}>
          + Job seekers and wider-market search
        </text>
        <line x1={210} y1={58} x2={210} y2={88} stroke={BLUE} strokeWidth={3} />
        <polygon points="202,86 218,86 210,98" fill={BLUE} />

        {/* The HireRevolution layer */}
        <rect x={10} y={100} width={400} height={120} rx={18} fill={BLUE} />
        <circle cx={58} cy={146} r={30} fill="#fff" />
        <image href="/logo-emblem.png" x={32} y={120} width={52} height={52} />
        <text x={100} y={143} fontSize={22} fontWeight={700} fill="#fff">
          HireRevolution
        </text>
        <text x={100} y={166} fontSize={15} fill={TINT}>
          The matching layer
        </text>
        <Chip x={24} y={184} w={92} label="Job profile" fill="#fff" color={BLUE} />
        <Chip x={124} y={184} w={138} label="Candidate profiles" fill="#fff" color={BLUE} />
        <Chip x={270} y={184} w={96} label="Match chart" fill="#fff" color={BLUE} />

        {/* Jobs and candidates up; match analysis back down */}
        <line x1={70} y1={278} x2={70} y2={232} stroke={NAVY} strokeWidth={3} />
        <polygon points="62,234 78,234 70,222" fill={NAVY} />
        <text x={84} y={246} fontSize={13} fontWeight={600} fill={NAVY}>
          Jobs and
        </text>
        <text x={84} y={263} fontSize={13} fontWeight={600} fill={NAVY}>
          candidates in
        </text>

        <line x1={350} y1={222} x2={350} y2={268} stroke={BLUE} strokeWidth={3} />
        <polygon points="342,266 358,266 350,278" fill={BLUE} />
        <text x={336} y={246} textAnchor="end" fontSize={13} fontWeight={600} fill={BLUE}>
          Match analysis
        </text>
        <text x={336} y={263} textAnchor="end" fontSize={13} fontWeight={600} fill={BLUE}>
          written back
        </text>

        {/* The customer's ATS, unchanged */}
        <rect x={10} y={280} width={400} height={110} rx={18} fill="#fff" stroke={NAVY} strokeWidth={2} />
        <text x={30} y={313} fontSize={22} fontWeight={700} fill={NAVY}>
          Your ATS
        </text>
        <text x={30} y={336} fontSize={15} fill={SLATE}>
          Stays your system of record
        </text>
        <Chip x={30} y={350} w={62} label="Jobs" fill={TINT} color={NAVY} />
        <Chip x={100} y={350} w={98} label="Candidates" fill={TINT} color={NAVY} />
        <Chip x={206} y={350} w={80} label="Records" fill={TINT} color={NAVY} />
      </svg>
    </div>
  );
}
