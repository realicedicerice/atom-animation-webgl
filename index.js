const canvas = document.querySelector('#canvas');

let gl = canvas.getContext('webgl');

const vertexShaderSource = document.querySelector('#vert').text;
const fragmentShaderSource = document.querySelector('#frag').text;

let program, positionAttributeLocation, positionBuffer, timeUniformLocation;

const start = Date.now();

function init() {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader));

    return;
  }

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader); 

  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(fragmentShader));

    return;
  }

  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

  positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, 1,
    -1, -1,
    1, -1,
    1, 1,
    1, -1,
    -1, 1
  ]), gl.STATIC_DRAW);

  timeUniformLocation = gl.getUniformLocation(program, 'u_time');

  gl.viewport(0, 0, 512, 512);

  render();
}

function render() {
  gl.clearColor(0, 0, 0, 255);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.uniform1f(timeUniformLocation, Date.now() - start);

  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLES, 0, 6);

  requestAnimationFrame(render);
}

init();