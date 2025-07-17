uniform sampler2D pointTexture;

varying vec3 vColor;

void main() {
    vec4 texColor = texture2D(pointTexture, gl_PointCoord);
    vec4 finalColor = vec4(vColor, 1.0) * texColor;

    // Optional discard for sharper alpha-edged points
    if (finalColor.a < 0.1) discard;

    gl_FragColor = finalColor;
}
