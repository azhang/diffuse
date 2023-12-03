let particles = [];

function setup() {
  var cnv = createCanvas(windowWidth - 10, windowHeight - 10);
  cnv.parent('sketch-container');

  for (let i = 0; i < 900; i++) {
    particles.push(new Particle());
  }

  textAlign(CENTER, TOP); // Align text to be centered horizontally and vertically aligned to the top
  textSize(20);
}

function draw() {
  clear();

  translate(width / 2, height / 2);

  for (let particle of particles) {
    particle.update();
    particle.display();
  }
  connectParticles();

  // Display the frame rate at the top middle
  /*
    push(); // Save the current drawing state
    resetMatrix(); // Reset transformations
    fill(255); // Set fill to white for visibility
    noStroke(); // No outline
    textAlign(CENTER, TOP); // Align text to be centered horizontally and at the top vertically
    text("FPS: " + frameRate().toFixed(2), width / 2, 10); // Display the frame rate at the top middle
    pop(); // Restore the original drawing state
    */
}

function connectParticles() {
  let maxDistance = 60; // Set a small distance for close proximity checks

  // Choose a random subset of particles to connect
  for (let i = 0; i < particles.length; i += int(random(1, 700))) { // Adjust the step for performance
    let closest = [];
    for (let j = 0; j < particles.length; j++) {
      if (i != j) {
        let d = dist(
          map(particles[i].x / particles[i].z, 0, 1, 0, width),
          map(particles[i].y / particles[i].z, 0, 1, 0, height),
          map(particles[j].x / particles[j].z, 0, 1, 0, width),
          map(particles[j].y / particles[j].z, 0, 1, 0, height)
        );

        // Collect close particles
        if (d < maxDistance) {
          closest.push({ index: j, distance: d });
        }
      }
    }

    // Sort found particles by distance
    closest.sort((a, b) => a.distance - b.distance);

    // Connect only to the two closest particles
    for (let k = 0; k < min(4, closest.length); k++) {
      // Draw lines with random opacities to create flashing effect
      let opacity = random(50, 150);
      stroke(255, opacity);
      strokeWeight(0.5);
      line(
        map(particles[i].x / particles[i].z, 0, 1, 0, width),
        map(particles[i].y / particles[i].z, 0, 1, 0, height),
        map(particles[closest[k].index].x / particles[closest[k].index].z, 0, 1, 0, width),
        map(particles[closest[k].index].y / particles[closest[k].index].z, 0, 1, 0, height)
      );
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth - 10, windowHeight - 10);
}

class Particle {
  constructor() {
    this.x = random(-width, width);
    this.y = random(-height, height);
    this.z = random(width);
    this.speed = random(0.25, 7);
    this.color = this.pickColor();
  }

  pickColor() {
    let categories = ['#ff1c4d', '#00568f', '#aa00ff', '#ffb700', '#8df9f9'];
    let weights = [0.2, 0.5, 1, 0.1, 0.7];
    let index = this.weightedRandom(weights);
    return categories[index];
  }

  weightedRandom(weights) {
    let sum = weights.reduce((acc, el) => acc + el, 0);
    let rand = random(sum);
    for (let i = 0; i < weights.length; i++) {
      if (rand < weights[i]) return i;
      rand -= weights[i];
    }
  }

  update() {
    this.z -= this.speed;
    if (this.z < 1) {
      this.z = width;
      this.x = random(-width, width);
      this.y = random(-height, height);
      this.color = this.pickColor(); // Reset color when 'z' is less than 1
    }
  }

  // Modified display method with a 'glow' effect
  display() {
    // Calculate size based on 'z' (depth) value to simulate focus
    let r = map(this.z, 0, width, 7, 0);

    fill(red(this.color), green(this.color), blue(this.color), this.opacity);

    let sx = map(this.x / this.z, 0, 1, 0, width);
    let sy = map(this.y / this.z, 0, 1, 0, height);

    ellipse(sx, sy, r, r);
  }
}
