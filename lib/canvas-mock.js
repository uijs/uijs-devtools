// based on: http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html

function HTMLCanvasElement() {
  this.width = 0;
  this.height = 0;
  this.style = {};
  return this;
}

HTMLCanvasElement.prototype.getContext = mock('getContext', function() { return new CanvasRenderingContext2D(this); });
HTMLCanvasElement.prototype.toDataURL = mock('toDataURL', function() { return '' });
HTMLCanvasElement.prototype.toDataURLHD = mock('toDataURLHD', function() { return '' });
HTMLCanvasElement.prototype.toBlob = mock('toBlob', function() { return '' });
HTMLCanvasElement.prototype.toBlobHD = mock('toBlobHD', function() { return '' });

function CanvasRenderingContext2D(canvas) {
  this.canvas = canvas;
  this.currentTransform = null;
  this.globalAlpha = 1.0;
  this.globalCompositeOperation = 'source-over';
  this.imageSmoothingEnabled = true;
  this.strokeStyle = 'black';
  this.fillStyle = 'black';
  this.shadowOffsetX = 0;
  this.shadowOffsetY = 0;
  this.shadowBlur = 0;
  this.shadowColor = 'rgba(0, 0, 0, 0.0)';
  this.lineWidth = 1;
  this.lineCap = 'butt';
  this.lineJoin = 'miter';
  this.miterLimit = 10;
  this.lineDashOffset = 0;
  this.font = '10x sans-serif';
  this.textAlign = 'start';
  this.textBaseline = 'alphabetic';
  return this;
}

CanvasRenderingContext2D.prototype.save = mock('save');
CanvasRenderingContext2D.prototype.restore = mock('restore');
CanvasRenderingContext2D.prototype.scale = mock('scale');
CanvasRenderingContext2D.prototype.rotate = mock('rotate');
CanvasRenderingContext2D.prototype.translate = mock('translate');
CanvasRenderingContext2D.prototype.transform = mock('transform');
CanvasRenderingContext2D.prototype.setTransform = mock('setTransform');
CanvasRenderingContext2D.prototype.resetTransform = mock('resetTransform');

CanvasRenderingContext2D.prototype.createLinearGradient = mock('createLinearGradient', function() { return new CanvasGradient(); });
CanvasRenderingContext2D.prototype.createRadialGradient = mock('createRadialGradient', function() { return new CanvasGradient(); });

CanvasRenderingContext2D.prototype.clearRect = mock('clearRect');
CanvasRenderingContext2D.prototype.fillRect = mock('fillRect');
CanvasRenderingContext2D.prototype.strokeRect = mock('strokeRect');

CanvasRenderingContext2D.prototype.beginPath = mock('beginPath');
CanvasRenderingContext2D.prototype.fill = mock('fill');
CanvasRenderingContext2D.prototype.stroke = mock('stroke');
CanvasRenderingContext2D.prototype.drawSystemFocusRing = mock('drawSystemFocusRing');
CanvasRenderingContext2D.prototype.drawCustomFocusRing = mock('drawCustomFocusRing');
CanvasRenderingContext2D.prototype.scrollPathIntoView = mock('scrollPathIntoView');
CanvasRenderingContext2D.prototype.clip = mock('clip');
CanvasRenderingContext2D.prototype.resetClip = mock('resetClip');
CanvasRenderingContext2D.prototype.isPointInPath = mock('isPointInPath', function() { return true; });

CanvasRenderingContext2D.prototype.fillText = mock('fillText');
CanvasRenderingContext2D.prototype.strokeText = mock('strokeText');
CanvasRenderingContext2D.prototype.measureText = mock('measureText', function(text) { return new TextMetrics(text); })

CanvasRenderingContext2D.prototype.drawImage = mock('drawImage');
CanvasRenderingContext2D.prototype.addHitRegion = mock('addHitRegion');
CanvasRenderingContext2D.prototype.removeHitRegion = mock('removeHitRegion');

CanvasRenderingContext2D.prototype.createImageData = mock('createImageData', function() { return new ImageData(); });
CanvasRenderingContext2D.prototype.createImageDataHD = mock('createImageDataHD', function() { return new ImageData(); });
CanvasRenderingContext2D.prototype.getImageData = mock('getImageData', function() { return new ImageData(); });
CanvasRenderingContext2D.prototype.putImageData = mock('putImageData');

CanvasRenderingContext2D.prototype.setLineDash = mock('setLineDash');
CanvasRenderingContext2D.prototype.getLineDash = mock('getLineDash', function() { return []; });

CanvasRenderingContext2D.prototype.closePath = mock('closePath');
CanvasRenderingContext2D.prototype.moveTo = mock('moveTo');
CanvasRenderingContext2D.prototype.lineTo = mock('lineTo');
CanvasRenderingContext2D.prototype.quadraticCurveTo = mock('quadraticCurveTo');
CanvasRenderingContext2D.prototype.bezierCurveTo = mock('bezierCurveTo');
CanvasRenderingContext2D.prototype.arcTo = mock('arcTo');
CanvasRenderingContext2D.prototype.rect = mock('rect');
CanvasRenderingContext2D.prototype.arc = mock('arc');
CanvasRenderingContext2D.prototype.ellipse = mock('ellipse');

function ImageData() {
  this.width = 0;
  this.height = 0;
  this.data = [];
  return this;
}

function CanvasGradient() {
  return this;
}

CanvasGradient.prototype.addColorStop = mock('addColorStop');

function CanvasPattern() {
  return this;
}

CanvasPattern.prototype.setTransform = mock('setTransform');

function TextMetrics(text) {
  this.width = text.length * 10;
  // readonly attribute double width; // advance width
  // readonly attribute double actualBoundingBoxLeft;
  // readonly attribute double actualBoundingBoxRight;

  // // y-direction
  // readonly attribute double fontBoundingBoxAscent;
  // readonly attribute double fontBoundingBoxDescent;
  // readonly attribute double actualBoundingBoxAscent;
  // readonly attribute double actualBoundingBoxDescent;
  // readonly attribute double emHeightAscent;
  // readonly attribute double emHeightDescent;
  // readonly attribute double hangingBaseline;
  // readonly attribute double alphabeticBaseline;
  // readonly attribute double ideographicBaseline;
  return this;
}

function mock(name, fn) {
  return function() {
    if (fn) {
      return fn.apply(this, arguments);
    }
    else {
      return null;
    }
  };
}

exports.HTMLCanvasElement = HTMLCanvasElement;
exports.CanvasRenderingContext2D = CanvasRenderingContext2D;