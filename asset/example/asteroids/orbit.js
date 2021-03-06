const k = 200;

class Orbit {
    constructor(x_, y_, r_, s, p) {
        this.x = x_;
        this.y = y_;
        this.r = r_;
        this.parent = p;
        this.child = null;
        this.speed = s;
        this.angle = -PI / 2;
        this.dist  = 0;
        this.color = [0,50,100];

        this.add_child = (dist, rad, angle, speed) => {
            let newr = rad;
            let newx = this.x;
            let newy = this.y;
            this.child = new Orbit(newx, newy, newr, speed, this);
            this.child.color = 255;
            this.child.angle = angle;
            this.child.dist  = (this.r/2) + dist;
            
            return this.child;
        };

        this.update = () => {
            let parent = this.parent;
            if (parent != null) {
                this.angle += this.speed;
                this.x = parent.x + this.dist * cos(this.angle);
                this.y = parent.y + this.dist * sin(this.angle);
            }
        };

        this.show = () => {
            fill(this.color);
            if (this.hasOwnProperty("reference_index")){
                let str = Asteroids.near_earth_objects[DAY][this.reference_index].name;
                stroke(0);
                text(str,this.x,this.y-this.r/2);
            }
            ellipse(this.x, this.y, this.r, this.r);
            stroke(255, 50);
            strokeWeight(1);
            noFill();
            ellipse(0,0,this.dist*2);
        };

        this.in_boundary = (x,y) => {
            let r = clamp(this.r, 16, 1000);
            return (
                x > (this.x) - r &&
                x < (this.x) + r &&
                y > (this.y) - r &&
                y < (this.y) + r
            )
        }
    }
}