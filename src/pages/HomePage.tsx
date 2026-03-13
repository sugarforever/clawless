import { useEffect, useRef } from 'react';

function LobsterCanvas({ width, height }: { width: number; height: number }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animRef = useRef<number>(0);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d')!;
		const dpr = window.devicePixelRatio || 1;
		canvas.width = width * dpr;
		canvas.height = height * dpr;
		ctx.scale(dpr, dpr);

		const cx = width / 2;
		const cy = height / 2;

		const orbs = [
			{ x: cx - 60, y: cy - 30, r: 140, color: [255, 77, 77], speed: 0.5, phase: 0 },
			{ x: cx + 70, y: cy + 20, r: 120, color: [255, 130, 90], speed: 0.4, phase: 2 },
			{ x: cx + 10, y: cy - 60, r: 110, color: [255, 50, 70], speed: 0.6, phase: 4 },
			{ x: cx - 30, y: cy + 50, r: 100, color: [220, 60, 80], speed: 0.35, phase: 1 },
			{ x: cx + 50, y: cy - 10, r: 130, color: [255, 100, 60], speed: 0.45, phase: 3 },
		];

		const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; life: number; maxLife: number }[] = [];
		for (let i = 0; i < 30; i++) {
			particles.push({
				x: cx + (Math.random() - 0.5) * 280,
				y: cy + (Math.random() - 0.5) * 280,
				vx: (Math.random() - 0.5) * 0.4,
				vy: (Math.random() - 0.5) * 0.4,
				r: Math.random() * 2.5 + 0.5,
				alpha: Math.random() * 0.6 + 0.2,
				life: Math.random() * 300,
				maxLife: 250 + Math.random() * 150,
			});
		}

		let t = 0;
		function draw() {
			t += 0.016;
			ctx.clearRect(0, 0, width, height);

			for (const orb of orbs) {
				const ox = orb.x + Math.sin(t * orb.speed + orb.phase) * 35;
				const oy = orb.y + Math.cos(t * orb.speed * 0.7 + orb.phase) * 25;
				const gradient = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.r);
				gradient.addColorStop(0, `rgba(${orb.color.join(',')}, 0.25)`);
				gradient.addColorStop(0.4, `rgba(${orb.color.join(',')}, 0.12)`);
				gradient.addColorStop(0.7, `rgba(${orb.color.join(',')}, 0.04)`);
				gradient.addColorStop(1, `rgba(${orb.color.join(',')}, 0)`);
				ctx.fillStyle = gradient;
				ctx.beginPath();
				ctx.arc(ox, oy, orb.r, 0, Math.PI * 2);
				ctx.fill();
			}

			for (const p of particles) {
				p.x += p.vx;
				p.y += p.vy;
				p.life += 1;
				if (p.life > p.maxLife) {
					p.x = cx + (Math.random() - 0.5) * 280;
					p.y = cy + (Math.random() - 0.5) * 280;
					p.life = 0;
				}
				const fade = 1 - Math.abs(p.life / p.maxLife - 0.5) * 2;
				ctx.fillStyle = `rgba(255, 77, 77, ${p.alpha * fade})`;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
				ctx.fill();
			}

			animRef.current = requestAnimationFrame(draw);
		}

		animRef.current = requestAnimationFrame(draw);
		return () => cancelAnimationFrame(animRef.current);
	}, [width, height]);

	return (
		<canvas
			ref={canvasRef}
			style={{ width, height }}
			className="absolute inset-0 m-auto"
		/>
	);
}

export default function HomePage() {
	return (
		<div className="flex flex-1 items-center justify-center">
			<div className="relative text-center">
				<div className="relative mx-auto mb-5 h-72 w-72">
					<div className="absolute -inset-32">
						<LobsterCanvas width={544} height={544} />
					</div>
					<div className="absolute inset-0 flex items-center justify-center text-6xl drop-shadow-sm">
						🦞
					</div>
				</div>
				<p className="text-base font-medium text-foreground/80">Pick up where you left off</p>
				<p className="mt-1.5 text-sm text-muted-foreground/60">Choose a session from the sidebar</p>
				<div className="mt-6 flex items-center justify-center gap-1 text-xs text-muted-foreground/30">
					<kbd className="rounded border border-border/50 px-1.5 py-0.5 font-mono text-[10px]">&#8984;N</kbd>
					<span>to start a new one</span>
				</div>
			</div>
		</div>
	);
}
