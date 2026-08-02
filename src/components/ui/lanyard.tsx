"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  Canvas,
  extend,
  useFrame,
  type ThreeElement,
  type ThreeEvent,
} from "@react-three/fiber";
import {
  Environment,
  Html,
  Lightformer,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";
import "./lanyard.css";
import { asset } from "@/lib/asset";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

/**
 * React Bits "Lanyard" — ipe asılı, fizikli kimlik kartı.
 *
 * İki kullanım biçimi var:
 *  - `cardContent`: kartın yüzüne canlı bir React kartı asılır (hover, tilt ve
 *    linkler çalışır). Sitede ekip bölümü bunu kullanır.
 *  - `frontImage` / `backImage`: GLB kartın dokusuna görsel basılır (spec API'si).
 */

// useTexture koşulsuz çağrılmalı; görsel verilmediğinde 1x1 şeffaf piksel.
const BLANK_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

// card.glb'nin atlasında ön yüz SOL yarıya, arka yüz SAĞ yarıya UV'lenmiş.
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

type DomDragState = {
  active: boolean;
  clientX: number;
  clientY: number;
  offset: THREE.Vector3;
  hasOffset: boolean;
};

type LanyardProps = {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: "cover" | "contain";
  lanyardImage?: string | null;
  lanyardWidth?: number;
  dropDirection?: -1 | 1;
  /** Kartın yüzü olarak canlı bir React kartı as (hover/tilt/link çalışır). */
  cardContent?: ReactNode;
};

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = "cover",
  lanyardImage = null,
  lanyardWidth = 1,
  dropDirection = 1,
  cardContent,
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [domDragging, setDomDragging] = useState(false);
  const [dropSequence, setDropSequence] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const domDrag = useRef<DomDragState>({
    active: false,
    clientX: 0,
    clientY: 0,
    offset: new THREE.Vector3(),
    hasOffset: false,
  });

  /* HTML kart yüzeyinden sürükleme: link/butonlar tıklanabilir kalır. */
  const onSurfacePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if ((event.target as HTMLElement).closest("a, button")) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      domDrag.current.active = true;
      domDrag.current.hasOffset = false;
      domDrag.current.clientX = event.clientX;
      domDrag.current.clientY = event.clientY;
      setDomDragging(true);
    },
    [],
  );

  const onSurfacePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!domDrag.current.active) return;
      domDrag.current.clientX = event.clientX;
      domDrag.current.clientY = event.clientY;
    },
    [],
  );

  const onSurfacePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      domDrag.current.active = false;
      domDrag.current.hasOffset = false;
      setDomDragging(false);
    },
    [],
  );

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setDropSequence((value) => value + 1);
        observer.disconnect();
      },
      { threshold: 0.24, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="lanyard-wrapper">
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        <ambientLight intensity={Math.PI * 1.3} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band
            isMobile={isMobile}
            frontImage={frontImage}
            backImage={backImage}
            imageFit={imageFit}
            lanyardImage={lanyardImage}
            lanyardWidth={lanyardWidth}
            dropDirection={dropDirection}
            dropSequence={dropSequence}
            cardContent={cardContent}
            domDragRef={domDrag}
            domDragging={domDragging}
            onSurfacePointerDown={onSurfacePointerDown}
            onSurfacePointerMove={onSurfacePointerMove}
            onSurfacePointerUp={onSurfacePointerUp}
          />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

type BandProps = {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile: boolean;
  frontImage: string | null;
  backImage: string | null;
  imageFit: "cover" | "contain";
  lanyardImage: string | null;
  lanyardWidth: number;
  dropDirection: -1 | 1;
  dropSequence: number;
  cardContent?: ReactNode;
  domDragRef: React.RefObject<DomDragState>;
  domDragging: boolean;
  onSurfacePointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onSurfacePointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onSurfacePointerUp: (event: ReactPointerEvent<HTMLDivElement>) => void;
};

type LanyardRigidBody = RapierRigidBody & { lerped?: THREE.Vector3 };

type LanyardModel = {
  nodes: { card: THREE.Mesh; clip: THREE.Mesh; clamp: THREE.Mesh };
  materials: {
    base: THREE.MeshPhysicalMaterial;
    metal: THREE.MeshStandardMaterial;
  };
};

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile,
  frontImage,
  backImage,
  imageFit,
  lanyardImage,
  lanyardWidth,
  dropDirection,
  dropSequence,
  cardContent,
  domDragRef,
  domDragging,
  onSurfacePointerDown,
  onSurfacePointerMove,
  onSurfacePointerUp,
}: BandProps) {
  const band = useRef<
    THREE.Mesh<
      InstanceType<typeof MeshLineGeometry>,
      InstanceType<typeof MeshLineMaterial>
    >
  >(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<LanyardRigidBody>(null!);
  const j2 = useRef<LanyardRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps: RigidBodyProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF(
    asset("/lanyard/card.glb"),
  ) as unknown as LanyardModel;

  /* İp ile kart arasındaki klips: karanlıkta kaybolmasın diye açık renk */
  const clipMaterial = useMemo(() => {
    const next = materials.metal.clone();
    next.color = new THREE.Color("#f4edcf");
    next.emissive = new THREE.Color("#5d5842");
    next.emissiveIntensity = 0.26;
    next.metalness = 0.68;
    next.roughness = 0.22;
    next.envMapIntensity = 1.9;
    return next;
  }, [materials.metal]);

  const sourceTexture = useTexture(lanyardImage ?? asset("/lanyard/lanyard.png"));
  const frontTex = useTexture(frontImage ?? BLANK_PIXEL);
  const backTex = useTexture(backImage ?? BLANK_PIXEL);

  const texture = useMemo(() => {
    const next = sourceTexture.clone();
    next.wrapS = THREE.RepeatWrapping;
    next.wrapT = THREE.RepeatWrapping;
    next.colorSpace = THREE.SRGBColorSpace;
    next.needsUpdate = true;
    return next;
  }, [sourceTexture]);

  useEffect(() => () => texture.dispose(), [texture]);
  useEffect(() => () => clipMaterial.dispose(), [clipMaterial]);

  /* Ön/arka görseli kartın atlas dokusuna oranını bozmadan yerleştir. */
  const cardMap = useMemo(() => {
    const baseMap = materials.base.map;
    if ((!frontImage && !backImage) || !baseMap) return baseMap;

    const baseImg = baseMap.image as HTMLImageElement | undefined;
    if (!baseImg) return baseMap;

    const width = baseImg.width;
    const height = baseImg.height;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return baseMap;

    // Kart kenarları ve dokunulmayan yüz için orijinal atlas korunur.
    ctx.drawImage(baseImg, 0, 0, width, height);

    const drawFitted = (
      source: unknown,
      rect: { x: number; y: number; w: number; h: number },
    ) => {
      const img = source as CanvasImageSource & {
        width: number;
        height: number;
      };
      if (!img?.width || !img?.height) return;
      const rx = rect.x * width;
      const ry = rect.y * height;
      const rw = rect.w * width;
      const rh = rect.h * height;
      const pick = imageFit === "contain" ? Math.min : Math.max;
      const scale = pick(rw / img.width, rh / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.drawImage(img, rx + (rw - dw) / 2, ry + (rh - dh) / 2, dw, dh);
      ctx.restore();
    };

    if (frontImage && frontTex.image) drawFitted(frontTex.image, FRONT_UV_RECT);
    if (backImage && backTex.image) drawFitted(backTex.image, BACK_UV_RECT);

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base.map]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(),
          new THREE.Vector3(),
          new THREE.Vector3(),
          new THREE.Vector3(),
        ],
        false,
        "chordal",
      ),
  );
  const [dragged, setDragged] = useState<false | THREE.Vector3>(false);
  const [hovered, setHovered] = useState(false);

  const getLerped = (body: LanyardRigidBody) => {
    if (!body.lerped) body.lerped = new THREE.Vector3().copy(body.translation());
    return body.lerped;
  };

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0],
  ]);

  useEffect(() => {
    if (
      dropSequence === 0 ||
      !fixed.current ||
      !j1.current ||
      !j2.current ||
      !j3.current ||
      !card.current
    ) {
      return;
    }

    const anchor = fixed.current.translation();
    const direction = dropDirection;
    const segmentPositions = [
      { x: anchor.x + direction * 0.22, y: anchor.y + 0.95, z: anchor.z },
      { x: anchor.x + direction * 0.44, y: anchor.y + 1.9, z: anchor.z },
      { x: anchor.x + direction * 0.66, y: anchor.y + 2.85, z: anchor.z },
    ] as const;

    const resetBody = (
      body: RapierRigidBody,
      translation: { x: number; y: number; z: number },
    ) => {
      body.setTranslation(translation, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      body.wakeUp();
    };

    resetBody(j1.current, segmentPositions[0]);
    resetBody(j2.current, segmentPositions[1]);
    resetBody(j3.current, segmentPositions[2]);
    j1.current.lerped?.copy(segmentPositions[0]);
    j2.current.lerped?.copy(segmentPositions[1]);

    const cardPosition = {
      x: segmentPositions[2].x,
      y: segmentPositions[2].y - 1.45,
      z: segmentPositions[2].z,
    };
    resetBody(card.current, cardPosition);

    const startRotation = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(0, 0, direction * 0.2),
    );
    card.current.setRotation(startRotation, true);
    card.current.setLinvel({ x: direction * 1.65, y: -1.15, z: 0 }, true);
    card.current.setAngvel({ x: 0, y: 0, z: direction * 1.3 }, true);
  }, [dropDirection, dropSequence]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragged ? "grabbing" : "grab";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [dragged, hovered]);

  useFrame((state, delta) => {
    const domDrag = domDragRef.current;

    if (dragged || domDrag.active) {
      if (domDrag.active) {
        const rect = state.gl.domElement.getBoundingClientRect();
        vec
          .set(
            ((domDrag.clientX - rect.left) / rect.width) * 2 - 1,
            -((domDrag.clientY - rect.top) / rect.height) * 2 + 1,
            0.5,
          )
          .unproject(state.camera);
      } else {
        vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      }
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());

      if (domDrag.active && !domDrag.hasOffset) {
        domDrag.offset.copy(vec).sub(card.current.translation());
        domDrag.hasOffset = true;
      }
      const offset = domDrag.active ? domDrag.offset : (dragged as THREE.Vector3);

      card.current?.setNextKinematicTranslation({
        x: vec.x - offset.x,
        y: vec.y - offset.y,
        z: vec.z - offset.z,
      });
    }

    if (!fixed.current) return;

    [j1, j2].forEach((ref) => {
      const lerped = getLerped(ref.current);
      const distance = Math.max(
        0.1,
        Math.min(1, lerped.distanceTo(ref.current.translation())),
      );
      lerped.lerp(
        ref.current.translation(),
        delta * (minSpeed + distance * (maxSpeed - minSpeed)),
      );
    });

    curve.points[0].copy(j3.current.translation());
    curve.points[1].copy(getLerped(j2.current));
    curve.points[2].copy(getLerped(j1.current));
    curve.points[3].copy(fixed.current.translation());
    band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));

    ang.copy(card.current.angvel());
    rot.copy(card.current.rotation());
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
  });

  const release = (event: ThreeEvent<PointerEvent>) => {
    (event.target as Element).releasePointerCapture(event.pointerId);
    setDragged(false);
  };

  const grab = (event: ThreeEvent<PointerEvent>) => {
    (event.target as Element).setPointerCapture(event.pointerId);
    setDragged(
      new THREE.Vector3()
        .copy(event.point)
        .sub(vec.copy(card.current.translation())),
    );
  };

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged || domDragging ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerUp={release}
            onPointerDown={grab}
          >
            {cardContent ? null : (
              <mesh geometry={nodes.card.geometry}>
                <meshPhysicalMaterial
                  map={cardMap}
                  map-anisotropy={16}
                  clearcoat={isMobile ? 0 : 1}
                  clearcoatRoughness={0.15}
                  roughness={0.7}
                  metalness={0.35}
                />
              </mesh>
            )}
            <mesh geometry={nodes.clip.geometry} material={clipMaterial} />
            <mesh geometry={nodes.clamp.geometry} material={clipMaterial} />

            {cardContent ? (
              <Html
                transform
                center
                position={[0, 0.18, 0.02]}
                distanceFactor={0.82}
                zIndexRange={[30, 0]}
                wrapperClass="lanyard-html-layer"
              >
                <div
                  className="lanyard-profile-surface"
                  onPointerDown={onSurfacePointerDown}
                  onPointerMove={onSurfacePointerMove}
                  onPointerUp={onSurfacePointerUp}
                  onPointerCancel={onSurfacePointerUp}
                >
                  {cardContent}
                </div>
              </Html>
            ) : null}
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          args={[{ resolution: new THREE.Vector2(1000, 1000) }]}
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap={1}
          map={texture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}

useGLTF.preload(asset("/lanyard/card.glb"));
