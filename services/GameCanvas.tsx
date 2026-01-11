
import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { LevelConfig, GameState } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';

interface GameCanvasProps {
  level: LevelConfig;
  onWin: () => void;
  onLose: () => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ level, onWin, onLose }) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const [shotsLeft, setShotsLeft] = useState(level.projectileCount);
  const [activeProjectile, setActiveProjectile] = useState<Matter.Body | null>(null);
  const enemyBodies = useRef<Matter.Body[]>([]);

  useEffect(() => {
    if (!sceneRef.current) return;

    // Matter.js setup
    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Constraint, Events } = Matter;
    
    const engine = Engine.create();
    engineRef.current = engine;
    const world = engine.world;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        wireframes: false,
        background: '#e0f2fe',
      }
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Ground and boundaries
    const ground = Bodies.rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 10, CANVAS_WIDTH, 40, { 
      isStatic: true,
      render: { fillStyle: '#4d7c0f' }
    });
    const leftWall = Bodies.rectangle(-10, CANVAS_HEIGHT/2, 20, CANVAS_HEIGHT, { isStatic: true });
    const rightWall = Bodies.rectangle(CANVAS_WIDTH + 10, CANVAS_HEIGHT/2, 20, CANVAS_HEIGHT, { isStatic: true });
    Composite.add(world, [ground, leftWall, rightWall]);

    // Slingshot Point
    const anchor = { x: 200, y: 400 };

    // Build Structures
    const blocks = level.structures.map(s => {
      const color = s.type === 'wood' ? '#92400e' : s.type === 'stone' ? '#4b5563' : '#bae6fd';
      return Bodies.rectangle(s.x, s.y, s.width, s.height, {
        render: { fillStyle: color, strokeStyle: '#000', lineWidth: 2 },
        friction: 0.5,
        restitution: 0.1
      });
    });
    Composite.add(world, blocks);

    // Build Enemies
    const enemies = level.enemies.map(e => {
      const body = Bodies.circle(e.x, e.y, e.radius, {
        label: 'enemy',
        render: { fillStyle: e.type === 'boss' ? '#dc2626' : '#22c55e', strokeStyle: '#000', lineWidth: 2 },
        friction: 0.5,
        restitution: 0.5
      });
      return body;
    });
    enemyBodies.current = enemies;
    Composite.add(world, enemies);

    // Projectile Spawning Logic
    let currentShots = level.projectileCount;
    let isFiring = false;

    const spawnProjectile = () => {
      if (currentShots <= 0) return;
      
      const projectile = Bodies.circle(anchor.x, anchor.y, 18, {
        label: 'projectile',
        render: { 
          fillStyle: '#111827',
          // Custom stickman drawing would be here, for now it's a solid circle representing his head
        },
        friction: 0.1,
        restitution: 0.5,
        density: 0.004
      });

      const sling = Constraint.create({
        pointA: anchor,
        bodyB: projectile,
        stiffness: 0.1,
        length: 0,
        render: { strokeStyle: '#1e293b', lineWidth: 3 }
      });

      Composite.add(world, [projectile, sling]);
      setActiveProjectile(projectile);

      // Mouse control for slingshot
      const mouse = Mouse.create(render.canvas);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: { visible: false }
        }
      });

      Composite.add(world, mouseConstraint);

      Events.on(mouseConstraint, 'mouseup', () => {
        if (projectile.position.x > anchor.x + 20 || projectile.position.y > anchor.y + 20 || projectile.position.x < anchor.x - 20) {
          // Release projectile after a short delay
          setTimeout(() => {
            sling.bodyB = null;
            sling.render.visible = false;
            isFiring = true;
          }, 20);
        }
      });
    };

    spawnProjectile();

    // Check for win/lose conditions
    const checkInterval = setInterval(() => {
      // 1. Check if all enemies are defeated or off-screen/high velocity
      const aliveEnemies = enemyBodies.current.filter(e => {
        // If it falls off the bottom or moves too far
        const isOffScreen = e.position.y > CANVAS_HEIGHT - 50; 
        const isFastEnough = e.speed > 0.5;
        // In this game, hitting the ground with enough force or falling off is "defeat"
        return !isOffScreen && e.speed < 2;
      });

      if (aliveEnemies.length === 0) {
        clearInterval(checkInterval);
        onWin();
      }

      // 2. Manage projectiles
      if (isFiring && activeProjectile) {
        // If projectile stops moving or goes off screen
        if (activeProjectile.position.x > CANVAS_WIDTH || activeProjectile.position.x < 0 || activeProjectile.speed < 0.2) {
          isFiring = false;
          currentShots--;
          setShotsLeft(currentShots);
          
          if (currentShots > 0) {
            spawnProjectile();
          } else if (aliveEnemies.length > 0) {
            // Wait a bit to see if structures still fall
            setTimeout(() => {
              if (enemyBodies.current.some(e => e.position.y < CANVAS_HEIGHT - 60)) {
                onLose();
              }
            }, 3000);
          }
        }
      }
    }, 500);

    return () => {
      clearInterval(checkInterval);
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
    };
  }, [level, onWin, onLose]);

  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur p-4 rounded-xl shadow-md border border-slate-200">
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">{level.name}</h2>
        <div className="flex gap-2 mt-2">
          {Array.from({ length: level.projectileCount }).map((_, i) => (
            <div 
              key={i} 
              className={`w-6 h-6 rounded-full border-2 border-slate-900 ${i < shotsLeft ? 'bg-slate-900' : 'bg-transparent border-dashed'}`}
            />
          ))}
        </div>
        <p className="text-xs text-slate-500 font-bold mt-2">SHOTS REMAINING</p>
      </div>

      <div ref={sceneRef} className="rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-800" />
      
      <div className="mt-8 flex gap-4 text-slate-500 text-sm italic font-medium">
        <span>Pull the stickman back to launch</span>
        <span>•</span>
        <span>Defeat red/green targets</span>
      </div>
    </div>
  );
};

export default GameCanvas;
