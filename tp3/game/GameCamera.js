export default class GameCamera {
  constructor(camera) {
    this.camera = camera;

    this.target = vec3.fromValues(16, 0, 16);
    this._up = vec3.fromValues(0, 1, 0);

    this.cameraIndex = 1;
    this.cameraPositions = [
      {
        // Player 1
        position: vec3.fromValues(16, 2, -5),
      },
      {
        // General
        position: vec3.fromValues(-40, 10, 14),
      },
      {
        // Player 2
        position: vec3.fromValues(16, 4, 50),
      },
    ];

    this.cameraAnimation = null;
    this.changeCamera();
  }

  inPlace() {
    const { position } = this.cameraPositions[this.cameraIndex];
    const curPos = vec3.fromValues(
      this.camera.position[0],
      this.camera.position[1],
      this.camera.position[2]
    );
    const curTarget = vec3.fromValues(
      this.camera.target[0],
      this.camera.target[1],
      this.camera.target[2]
    );
    const curUp = vec3.fromValues(
      this.camera._up[0],
      this.camera._up[1],
      this.camera._up[2]
    );

    return (
      JSON.stringify(curPos) == JSON.stringify(position) &&
      JSON.stringify(curTarget) == JSON.stringify(this.target) &&
      JSON.stringify(curUp) == JSON.stringify(this._up)
    );
  }


  changeCamera() {
    this.cameraIndex = (this.cameraIndex + 1) % this.cameraPositions.length;

    if (this.cameraAnimation != null || this.inPlace()) return;

    this.cameraAnimation = {
      elapsedTime: 0,
      interval: 700,
    };
  }

  update(time) {
    if (this.cameraAnimation == null) return;

    this.cameraAnimation.elapsedTime += time;

    if (this.cameraAnimation.elapsedTime > this.cameraAnimation.interval) {
      this.cameraAnimation = null;
      // Last transition
      this.camera.setPosition(this.cameraPositions[this.cameraIndex].position);
      this.camera.setTarget(this.target);
      vec3.copy(this.camera._up, this._up);
      return;
    }

    const timePercentage =
      this.cameraAnimation.elapsedTime / this.cameraAnimation.interval;
    const curCamera = this.cameraPositions[this.cameraIndex];

    let curTarget = vec3.fromValues(
      this.camera.target[0],
      this.camera.target[1],
      this.camera.target[2]
    );
    if (JSON.stringify(curTarget) != JSON.stringify(this.target)) {
      vec3.lerp(curTarget, curTarget, this.target, timePercentage);
      this.camera.setTarget(curTarget);
    }

    let curPos = vec3.fromValues(
      this.camera.position[0],
      this.camera.position[1],
      this.camera.position[2]
    );
    if (JSON.stringify(curPos) != JSON.stringify(curCamera.position)) {
      vec3.lerp(curPos, curPos, curCamera.position, timePercentage);
      this.camera.setPosition(curPos);
    }

    let curUp = vec3.fromValues(
      this.camera._up[0],
      this.camera._up[1],
      this.camera._up[2]
    );
    if (JSON.stringify(curUp) != JSON.stringify(this._up)) {
      vec3.lerp(curUp, curUp, this._up, timePercentage);
      vec3.copy(this.camera._up, this._up);
    }
  }
}
