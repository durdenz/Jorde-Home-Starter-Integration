uniform vec3 color;
uniform sampler2D pointTexture;
uniform float alphaTest;

// Add these two uniforms for emissive
uniform vec3 emissiveColor;
uniform float emissiveIntensity;

varying vec3 vColor;

void main() {

    // Base color modulated by vertex color
    vec4 baseColor = vec4(color * vColor, 1.0);

    // Sample texture color
    vec4 texColor = texture2D(pointTexture, gl_PointCoord);

    // Combine base color and texture
    vec4 finalColor = baseColor * texColor;

    // Add emissive glow
    finalColor.rgb += emissiveColor * emissiveIntensity;

    // Discard transparent pixels
    if (finalColor.a < alphaTest) discard;

    gl_FragColor = finalColor;
}