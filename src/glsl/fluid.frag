varying vec2 vUv;
// Mouse/Touch position
uniform vec2 pointer;
// Time
uniform float time;
uniform float delta;
// Velocity
uniform sampler2D velocity;
// aspect ratio
uniform float aspectRatio;
// BFECC (固定でtrue)
// uniform bool isBFECC;
uniform vec2 force;
//
uniform vec2 px;
// 
uniform float v;

/**
* 外力項
* 
*/
vec4 getExternalForce(vec2 uv){
  vec2 circle = (uv - 0.5) * 2.0;
  float d = 1.0 - min(length(circle), 1.0);
  d *= d;
  return vec4(force * d, 0.0, 1.0);
}

/**
* Get the divergence of a velocity field 
* ※流体速度の発散を取得する
*/
vec4 getDivergence(vec2 uv){
  float x0 = texture2D(velocity, uv + vec2(-1.0, 0.0)).x;
  float x1 = texture2D(velocity, uv + vec2(1.0, 0.0)).x;
  float y0 = texture2D(velocity, uv + vec2(0.0, -1.0)).y;
  float y1 = texture2D(velocity, uv + vec2(0.0, 1.0)).y;
  return vec4((x1 - x0 + y1 - y0) * 0.5, 0.0, 0.0, 1.0);
}

/**
* Get the advection of a velocity field
* ※流体の流れを取得する [移流項]
*/
vec4 getAdvection(vec2 uv){
  // BFECC方式
  vec2 spot_new = uv;
  vec2 vel_old = texture2D(velocity, uv).xy;
  vec2 spot_old = spot_new - vel_old * delta * aspectRatio;
  vec2 vel_new1 = texture2D(velocity, spot_old).xy;
  // forward trace
  vec2 spot_new2 = spot_new - vel_new1 * delta * aspectRatio;
  vec2 error = spot_new2 - spot_new;
  vec2 spot_new3 = spot_new - error / 2.0;
  vec2 vel_2 = texture2D(velocity, spot_new3).xy;
  // backward trace
  vec2 spot_old2 = spot_new3 + vel_2 * delta * aspectRatio;
  vec2 vel_new2 = texture2D(velocity, spot_old2).xy;
  return vec4(vel_new2, 0.0, 0.0);
}

/**
* 
*  [粘性項]
* 
*/
vec4 getViscous(sampler2D velocity_new, vec2 uv){
  vec2 old = texture2D(velocity, uv).xy;
  vec2 new0 = texture2D(velocity_new, uv + vec2(px.x * 2.0, 0.0)).xy;
  vec2 new1 = texture2D(velocity_new, uv - vec2(px.x * 2.0, 0.0)).xy;
  vec2 new2 = texture2D(velocity_new, uv + vec2(0.0, px.y * 2.0)).xy;
  vec2 new3 = texture2D(velocity_new, uv - vec2(0.0, px.y * 2.0)).xy;

  vec2 new = 4.0 * old + v * delta * (new0 + new1 + new2 + new3);
  new /= 4.0 * (1.0 + v * delta);
  return vec4(new, 0.0, 0.0);
}

void main(){
  vec2 uv = vUv;
  // [外力項] Pointerの中心ほど強くなる円形
  vec4 externalForce = getExternalForce(uv);
  // [移流項]
  vec4 advection = getAdvection(uv);
  // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  // gl_FragColor = externalForce;
  gl_FragColor = advection;
}