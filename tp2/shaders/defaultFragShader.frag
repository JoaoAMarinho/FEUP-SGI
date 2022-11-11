#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
varying vec3 offset;

uniform float timeFactor;
uniform vec4 pulseColor;

void main() {
	vec4 textColor = texture2D(uSampler, vTextureCoord);
	vec4 color = mix(pulseColor, textColor, (sin(timeFactor) + 1.0) / 2.0);
	
	gl_FragColor =  color;
}