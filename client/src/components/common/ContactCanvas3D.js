import React, { useRef, useEffect, useCallback, forwardRef } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const ContactCanvas3D = forwardRef(({ 
  color = '#007BFF', 
  accentColor = '#00F2FF',
  particleCount = 500,
  className = ''
}, ref) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const particlesRef = useRef(null);
  const linesRef = useRef(null);
  const groupRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameIdRef = useRef(null);

  const initScene = useCallback(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Cleanup existing
    if (rendererRef.current) {
        if (rendererRef.current.domElement.parentNode) {
            mount.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
    }

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    // 1. Digital Connection Nodes (Particles)
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i+1] = (Math.random() - 0.5) * 10;
      positions[i+2] = (Math.random() - 0.5) * 10;
      
      velocities[i] = (Math.random() - 0.5) * 0.02;
      velocities[i+1] = (Math.random() - 0.5) * 0.02;
      velocities[i+2] = (Math.random() - 0.5) * 0.02;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      size: 0.05,
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    group.add(particles);
    particlesRef.current = { mesh: particles, velocities };

    // 2. Dynamic Connection Lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(accentColor),
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * 6); // Just a placeholder for connections
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(lines);
    linesRef.current = lines;

    // 3. Central Interactive Element (Holographic Mail Icon)
    // We'll use a simple wireframe box/envelope shape for now
    const envelopeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.5, 1, 0.2));
    const envelopeMat = new THREE.LineBasicMaterial({ color: accentColor, linewidth: 2 });
    const envelope = new THREE.LineSegments(envelopeGeo, envelopeMat);
    envelope.position.set(0, 0, 0);
    group.add(envelope);
    
    // Add inner "V" for envelope
    const vGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-0.75, 0.5, 0.1),
        new THREE.Vector3(0, 0, 0.1),
        new THREE.Vector3(0, 0, 0.1),
        new THREE.Vector3(0.75, 0.5, 0.1)
    ]);
    const vLine = new THREE.LineSegments(vGeo, envelopeMat);
    envelope.add(vLine);

    return { scene, camera, renderer, group };
  }, [color, accentColor, particleCount]);

  const animate = useCallback(() => {
    frameIdRef.current = requestAnimationFrame(animate);

    if (particlesRef.current) {
      const { mesh, velocities } = particlesRef.current;
      const positions = mesh.geometry.attributes.position.array;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i];
        positions[i+1] += velocities[i+1];
        positions[i+2] += velocities[i+2];

        // Bounce back
        if (Math.abs(positions[i]) > 5) velocities[i] *= -1;
        if (Math.abs(positions[i+1]) > 5) velocities[i+1] *= -1;
        if (Math.abs(positions[i+2]) > 5) velocities[i+2] *= -1;
      }
      mesh.geometry.attributes.position.needsUpdate = true;
    }

    if (groupRef.current) {
        groupRef.current.rotation.y += 0.002;
        groupRef.current.rotation.x += 0.001;
        
        // Tilt towards mouse
        groupRef.current.rotation.y += (mouseRef.current.x * 0.5 - groupRef.current.rotation.y) * 0.05;
        groupRef.current.rotation.x += (-mouseRef.current.y * 0.5 - groupRef.current.rotation.x) * 0.05;
    }

    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!mountRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
  }, []);

  useEffect(() => {
    initScene();
    animate();
    const mount = mountRef.current;
    if (mount) mount.addEventListener('mousemove', onMouseMove);
    
    const handleResize = () => {
        if (!mount || !cameraRef.current || !rendererRef.current) return;
        cameraRef.current.aspect = mount.clientWidth / mount.clientHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (mount) mount.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      if (rendererRef.current) rendererRef.current.dispose();
    };
  }, [initScene, onMouseMove, animate]);

  return (
    <motion.div 
      ref={mountRef}
      className={`contact-canvas-3d ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        zIndex: 0,
        pointerEvents: 'none' 
      }}
    />
  );
});

ContactCanvas3D.displayName = 'ContactCanvas3D';
export default ContactCanvas3D;
