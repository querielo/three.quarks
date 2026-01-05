import {
    Fn,
    attribute,
    vec3,
    vec4,
    mat4,
    mat3,
    float,
    positionGeometry,
    normalGeometry,
    modelViewMatrix,
    modelNormalMatrix,
    normalize,
    vec2,
    uv,
    cameraProjectionMatrix,
    texture,
    mix,
    mul,
    color,
    varying,
    uniform,
    saturate,
    cameraNear,
    cameraFar,
    linearDepth,
    viewZToOrthographicDepth,
} from 'three/tsl';
import {
    MeshStandardNodeMaterial,
    MeshPhysicalNodeMaterial,
    SpriteNodeMaterial,
    NodeMaterial,
    MeshBasicNodeMaterial,
    LineBasicNodeMaterial,
    ViewportDepthTextureNode,
} from 'three/webgpu';
import { nodeProxy } from 'three/tsl';

const viewportDepthTexture = nodeProxy( ViewportDepthTextureNode );

const getTilingColorNode = (parameters: any, debug: boolean) => {
    if (!debug && (parameters?.uTileCount > 1 || parameters?.vTileCount > 1)) {
        const uvNode = uv();
        const frameNode = attribute('uvTile', 'float');
        const countNode = vec2(parameters.uTileCount, parameters.vTileCount);
        const width = countNode.x;
        const height = countNode.y;
        const frameNum = frameNode.mod(width.mul(height)).floor();
        const column = frameNum.mod(width);
        const row = height.sub(frameNum.add(1).div(width).ceil());
        const scale = countNode.reciprocal();
        const uvFrameOffset = vec2(column, row);
        const tileUV = uvNode.add(uvFrameOffset).mul(scale);
        let colorNode = texture(parameters.map, tileUV);
        if (parameters.blendTiles) {
            const nextFrame = frameNode.add(1).mod(parameters.uTileCount * parameters.vTileCount);
            const nextFrameNum = nextFrame.mod(width.mul(height)).floor();
            const nextColumn = nextFrameNum.mod(width);
            const nextRow = height.sub(nextFrameNum.add(1).div(width).ceil());
            const nextUvFrameOffset = vec2(nextColumn, nextRow);
            const nextTileUV = uvNode.add(nextUvFrameOffset).mul(scale);
            const blend = frameNode.fract();
            colorNode = mix(colorNode, texture(parameters.map, nextTileUV), blend) as any;
        }
        return colorNode;
    }
    return null;
};

const particleMatrixFn = /*@__PURE__*/ Fn(() => {
    const offset = attribute('offset', 'vec3');
    const rotation = attribute('rotation', 'vec4');
    const size = attribute('size', 'vec3');

    const x2 = rotation.x.add(rotation.x);
    const y2 = rotation.y.add(rotation.y);
    const z2 = rotation.z.add(rotation.z);
    const xx = rotation.x.mul(x2);
    const xy = rotation.x.mul(y2);
    const xz = rotation.x.mul(z2);
    const yy = rotation.y.mul(y2);
    const yz = rotation.y.mul(z2);
    const zz = rotation.z.mul(z2);
    const wx = rotation.w.mul(x2);
    const wy = rotation.w.mul(y2);
    const wz = rotation.w.mul(z2);

    const sx = size.x;
    const sy = size.y;
    const sz = size.z;

    const m00 = float(1.0).sub(yy).sub(zz).mul(sx);
    const m01 = xy.add(wz).mul(sx);
    const m02 = xz.sub(wy).mul(sx);
    const m03 = float(0.0);
    const m10 = xy.sub(wz).mul(sy);
    const m11 = float(1.0).sub(xx).sub(zz).mul(sy);
    const m12 = yz.add(wx).mul(sy);
    const m13 = float(0.0);
    const m20 = xz.add(wy).mul(sz);
    const m21 = yz.sub(wx).mul(sz);
    const m22 = float(1.0).sub(xx).sub(yy).mul(sz);
    const m23 = float(0.0);
    const m30 = offset.x;
    const m31 = offset.y;
    const m32 = offset.z;
    const m33 = float(1.0);

    return (mat4 as any)(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
});

const setupParticleMeshNodes = (material: NodeMaterial) => {
    material.positionNode = Fn(() => {
        const particleMatrix = particleMatrixFn();
        const transformed = positionGeometry;
        return particleMatrix.mul(vec4(transformed, 1.0)).xyz;
    })();

    material.normalNode = Fn(() => {
        const particleMatrix = particleMatrixFn();
        const transformedNormal = normalGeometry;

        const m = mat3(particleMatrix);

        const scaleX = m[0].dot(m[0]).sqrt();
        const scaleY = m[1].dot(m[1]).sqrt();
        const scaleZ = m[2].dot(m[2]).sqrt();
        const normalizedNormal = transformedNormal.div(vec3(scaleX, scaleY, scaleZ));

        const rotatedNormal = m.mul(normalizedNormal);

        return modelNormalMatrix.mul(rotatedNormal);
    })();
};

const setMaterialValues = ( material: any, values: any ) => {

    if ( values === undefined ) return;

    for ( const key in values ) {

        const newValue = values[ key ];

        // if ( newValue === undefined ) {

        //     console.warn( `THREE.Material: parameter '${ key }' has value of undefined.` );
        //     continue;

        // }

        // @ts-ignore
        const currentValue = material[ key ];

        // if ( currentValue === undefined ) {

        //     console.warn( `THREE.Material: '${ key }' is not a property of THREE.${ material.type }.` );
        //     continue;

        // }

        if ( currentValue && currentValue.isColor ) {

            currentValue.set( newValue );

        } else if ( ( currentValue && currentValue.isVector3 ) && ( newValue && newValue.isVector3 ) ) {

            currentValue.copy( newValue );

        } else {

            // @ts-ignore
            material[ key ] = newValue;

        }

    }

};

export class ParticleMeshStandardNodeMaterial extends MeshStandardNodeMaterial {
    uTileCount: number;
    vTileCount: number;
    blendTiles: boolean;

    constructor(parameters?: any) {
        super(parameters);

        const debug = parameters?.debug || false;

        if (debug) {
            this.colorNode = vec4(uv(), 0.0, 1.0);
        }

        setupParticleMeshNodes(this);

        // Define tiling properties
        this.uTileCount = parameters?.uTileCount || 1;
        this.vTileCount = parameters?.vTileCount || 1;
        this.blendTiles = parameters?.blendTiles || false;

        // Tiling logic
        if (!parameters?.colorNode && !debug) {
            const tilingColorNode = getTilingColorNode(parameters, debug);
            const instanceColor = attribute('color', 'vec4');
            if (tilingColorNode) {
                this.colorNode = tilingColorNode.mul(instanceColor);
            }
        }
    }

    static get type() {
        return 'ParticleMeshStandardNodeMaterial';
    }
}

export class ParticleMeshPhysicalNodeMaterial extends MeshPhysicalNodeMaterial {
    uTileCount: number;
    vTileCount: number;
    blendTiles: boolean;

    constructor(parameters?: any) {
        super(parameters);

        const debug = parameters?.debug || false;

        if (debug) {
            this.colorNode = vec4(uv(), 0.0, 1.0);
        }

        setupParticleMeshNodes(this);

        // Define tiling properties
        this.uTileCount = parameters?.uTileCount || 1;
        this.vTileCount = parameters?.vTileCount || 1;
        this.blendTiles = parameters?.blendTiles || false;

        // Tiling logic
        if (!parameters?.colorNode && !debug) {
            const tilingColorNode = getTilingColorNode(parameters, debug);
            const instanceColor = attribute('color', 'vec4');
            if (tilingColorNode) {
                this.colorNode = tilingColorNode.mul(instanceColor);
            }
        }
    }

    static get type() {
        return 'ParticleMeshPhysicalNodeMaterial';
    }

    setValues( values: any ) {

        setMaterialValues( this, values );

    }
}

export class ParticleBillboardNodeMaterial extends SpriteNodeMaterial {
    uTileCount: number;
    vTileCount: number;
    blendTiles: boolean;
    softParams: any;

    constructor(parameters?: any) {
        super(parameters);

        const debug = parameters?.debug || false;

        // Define tiling properties
        this.uTileCount = parameters?.uTileCount || 1;
        this.vTileCount = parameters?.vTileCount || 1;
        this.blendTiles = parameters?.blendTiles || !false;

        this.positionNode = attribute('offset', 'vec3');
        this.scaleNode = vec2(attribute('size', 'vec3').xy);

        // Tiling logic
        const tilingColorNode = getTilingColorNode(parameters, debug);
        const instanceColor = attribute('color', 'vec4');
        if (tilingColorNode) {
            this.colorNode = tilingColorNode.mul(instanceColor);
        } else if (parameters?.colorNode) {
            this.colorNode = parameters.colorNode.mul(instanceColor);
        } else if (this.map && this.map.isTexture === true) {
            this.colorNode = texture(this.map).mul(instanceColor);
        }

        if (debug) {
            this.colorNode = vec4(uv(), 0.0, 1.0);
        }

        if (parameters?.softParticles) {
            // TODO: implement
        }
    }

    setValues( values: any ) {

        setMaterialValues( this, values );

    }
}

export class ParticleMeshNodeMaterial extends MeshBasicNodeMaterial {
    uTileCount: number;
    vTileCount: number;
    blendTiles: boolean;

    constructor(parameters?: any) {
        super(parameters);

        const debug = parameters?.debug || false;

        // Define tiling properties
        this.uTileCount = parameters?.uTileCount || 1;
        this.vTileCount = parameters?.vTileCount || 1;
        this.blendTiles = parameters?.blendTiles || false;

        if (debug) {
            this.colorNode = vec4(uv(), 0.0, 1.0);
        }

        if (parameters) {
            Object.assign(this, parameters);
        }

        this.positionNode = Fn(() => {
            const particleMatrix = particleMatrixFn();
            const transformed = positionGeometry;
            return particleMatrix.mul(vec4(transformed, 1.0)).xyz;
        })();

        if (!parameters?.colorNode) {
            let colorNode = (this.color !== undefined ? color(this.color) : vec4(1.0)) as any;
            const tilingColorNode = getTilingColorNode(parameters, debug);
            const instanceColor = attribute('color', 'vec4');
            if (tilingColorNode) {
                colorNode = tilingColorNode.mul(instanceColor);
            } else {
                if (this.map && this.map.isTexture === true) {
                    colorNode = colorNode.mul(texture(this.map));
                }
                colorNode = colorNode.mul(instanceColor);
            }
            this.colorNode = colorNode;
        }
    }

    static get type() {
        return 'ParticleMeshNodeMaterial';
    }

    setValues( values: any ) {

        setMaterialValues( this, values );

    }
}

export class TrailNodeMaterial extends LineBasicNodeMaterial {
    constructor(parameters?: any) {
        super();

        if (parameters) {
            Object.assign(this, parameters);
        }

        this.vertexNode = Fn(() => {
            const position = attribute('position', 'vec3');
            const previous = attribute('previous', 'vec3');
            const next = attribute('next', 'vec3');
            const side = attribute('side', 'float');
            const width = attribute('width', 'float');

            const lineWidth = float(1.0);
            const sizeAttenuation = float(0.0);

            const mvPosition = modelViewMatrix.mul(vec4(position, 1.0));
            const projPosition = cameraProjectionMatrix.mul(vec4(mvPosition.xyz, 1.0));

            const offset = vec2(side.mul(width).mul(0.5), 0.0);
            const screenPos = projPosition.xy.div(projPosition.w);
            const finalPos = vec4(screenPos.add(offset), projPosition.z, projPosition.w);

            return finalPos;
        })();
    }

    static get type() {
        return 'TrailNodeMaterial';
    }

    setValues( values: any ) {

        setMaterialValues( this, values );

    }
}

export class ParticleSpriteNodeMaterial extends ParticleBillboardNodeMaterial {
    static get type() {
        return 'ParticleSpriteNodeMaterial';
    }
}

export class ParticleHorizontalBillboardNodeMaterial extends ParticleBillboardNodeMaterial {
    static get type() {
        return 'ParticleHorizontalBillboardNodeMaterial';
    }
}

export class ParticleVerticalBillboardNodeMaterial extends ParticleBillboardNodeMaterial {
    static get type() {
        return 'ParticleVerticalBillboardNodeMaterial';
    }
}

export class ParticleStretchedBillboardNodeMaterial extends ParticleBillboardNodeMaterial {
    static get type() {
        return 'ParticleStretchedBillboardNodeMaterial';
    }
}
