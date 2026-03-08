let currentTriangle = null;
let score = 0;

class Triangle {
    constructor(types) {
        this.types = types; // Array of characteristics
        this.generatePoints();
        this.calculateSidesAndAngles();
    }

    generatePoints() {
        // Fonction utilitaire pour générer un nombre aléatoire dans une plage
        const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        
        // Base configuration pour différents types de triangles
        const configurations = {
            'equilateral': () => {
                const centerX = random(200, 300);
                const centerY = random(150, 200);
                const size = random(120, 180);
                const height = size * Math.sqrt(3) / 2;
                
                return {
                    points: [
                        {x: centerX, y: centerY - height/2},
                        {x: centerX - size/2, y: centerY + height/2},
                        {x: centerX + size/2, y: centerY + height/2}
                    ],
                    characteristics: ['equilateral', 'acutangle', 'isocele']
                };
            },
            'isocele-acutangle': () => {
                const baseWidth = random(150, 250);
                const height = random(150, 200);
                const centerX = random(200, 300);
                const baseY = random(250, 300);
                
                return {
                    points: [
                        {x: centerX, y: baseY - height},
                        {x: centerX - baseWidth/2, y: baseY},
                        {x: centerX + baseWidth/2, y: baseY}
                    ],
                    characteristics: ['isocele', 'acutangle']
                };
            },
            'isocele-rectangle': () => {
                const baseWidth = random(150, 200);
                const centerX = random(200, 300);
                const baseY = random(280, 320);
                
                return {
                    points: [
                        {x: centerX, y: baseY - baseWidth},
                        {x: centerX - baseWidth/2, y: baseY},
                        {x: centerX + baseWidth/2, y: baseY}
                    ],
                    characteristics: ['isocele', 'rectangle']
                };
            },
            'isocele-obtusangle': () => {
                const baseWidth = random(150, 200);
                const height = random(60, 80);
                const centerX = random(200, 300);
                const baseY = random(280, 320);
                
                return {
                    points: [
                        {x: centerX, y: baseY - height},
                        {x: centerX - baseWidth/2, y: baseY},
                        {x: centerX + baseWidth/2, y: baseY}
                    ],
                    characteristics: ['isocele', 'obtusangle']
                };
            },
            'scalene-acutangle': () => {
                const x1 = random(100, 150);
                const y1 = random(80, 120);
                const x2 = random(80, 120);
                const y2 = random(280, 320);
                const x3 = random(300, 350);
                const y3 = random(200, 250);
                
                return {
                    points: [
                        {x: x1, y: y1},
                        {x: x2, y: y2},
                        {x: x3, y: y3}
                    ],
                    characteristics: ['scalene', 'acutangle']
                };
            },
            'scalene-rectangle': () => {
                const baseX = random(100, 150);
                const baseY = random(280, 320);
                const height = random(150, 200);
                const width = random(180, 240);
                
                return {
                    points: [
                        {x: baseX, y: baseY - height},
                        {x: baseX, y: baseY},
                        {x: baseX + width, y: baseY}
                    ],
                    characteristics: ['scalene', 'rectangle']
                };
            },
            'scalene-obtusangle': () => {
                const x1 = random(50, 100);
                const y1 = random(120, 160);
                const x2 = random(150, 200);
                const y2 = random(280, 320);
                const x3 = random(320, 370);
                const y3 = random(200, 250);
                
                return {
                    points: [
                        {x: x1, y: y1},
                        {x: x2, y: y2},
                        {x: x3, y: y3}
                    ],
                    characteristics: ['scalene', 'obtusangle']
                };
            }
        };

        const configKeys = Object.keys(configurations);
        const selectedConfigKey = configKeys[Math.floor(Math.random() * configKeys.length)];
        const selectedConfig = configurations[selectedConfigKey]();
        this.points = selectedConfig.points;
        this.types = selectedConfig.characteristics;
    }

    calculateSidesAndAngles() {
        // Calcul des côtés du triangle
        this.sides = [
            Math.sqrt(
                Math.pow(this.points[1].x - this.points[0].x, 2) +
                Math.pow(this.points[1].y - this.points[0].y, 2)
            ),
            Math.sqrt(
                Math.pow(this.points[2].x - this.points[1].x, 2) +
                Math.pow(this.points[2].y - this.points[1].y, 2)
            ),
            Math.sqrt(
                Math.pow(this.points[0].x - this.points[2].x, 2) +
                Math.pow(this.points[0].y - this.points[2].y, 2)
            )
        ];

        // Calcul des angles
        let angles = [
            this.calculateAngle(this.points[0], this.points[1], this.points[2]),
            this.calculateAngle(this.points[1], this.points[2], this.points[0]),
            this.calculateAngle(this.points[2], this.points[0], this.points[1])
        ];

        // Vérification et ajustement pour que la somme soit exactement 180°
        const sum = angles.reduce((a, b) => a + b, 0);
        if (Math.abs(sum - 180) < 1) {
            // Si la différence est minime, ajuster proportionnellement
            const factor = 180 / sum;
            angles = angles.map(angle => Math.round(angle * factor));
        }

        this.angles = angles;

        // Vérification des propriétés spéciales
        if (this.types.includes('rectangle')) {
            // Pour un triangle rectangle, un angle doit être exactement 90°
            const maxAngleIndex = angles.indexOf(Math.max(...angles));
            angles[maxAngleIndex] = 90;
            // Ajuster les autres angles si nécessaire
            const remainingSum = angles.reduce((sum, angle, i) => i !== maxAngleIndex ? sum + angle : sum, 0);
            const factor = 90 / remainingSum;
            angles = angles.map((angle, i) => i !== maxAngleIndex ? Math.round(angle * factor) : 90);
        }
        else if (this.types.includes('equilateral')) {
            // Pour un triangle équilatéral, tous les angles sont 60°
            this.angles = [60, 60, 60];
        }
        else if (this.types.includes('isocele')) {
            // Pour un triangle isocèle, deux angles doivent être égaux
            const baseAngles = angles.filter(a => Math.abs(a - angles[0]) < 1);
            if (baseAngles.length >= 2) {
                const avgBaseAngle = Math.round((baseAngles[0] + baseAngles[1]) / 2);
                const topAngle = 180 - 2 * avgBaseAngle;
                this.angles = [avgBaseAngle, avgBaseAngle, topAngle];
            }
        }
    }

    calculateAngle(p1, p2, p3) {
        // Calcul des côtés du triangle
        const a = Math.sqrt(Math.pow(p2.x - p3.x, 2) + Math.pow(p2.y - p3.y, 2));
        const b = Math.sqrt(Math.pow(p1.x - p3.x, 2) + Math.pow(p1.y - p3.y, 2));
        const c = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
        
        // Utilisation de la loi des cosinus
        let angle = Math.acos((a * a + c * c - b * b) / (2 * a * c));
        
        // Conversion en degrés et arrondi à l'unité
        return Math.round((angle * 180) / Math.PI);
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        ctx.lineTo(this.points[1].x, this.points[1].y);
        ctx.lineTo(this.points[2].x, this.points[2].y);
        ctx.closePath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Configuration du texte
        ctx.font = '14px Arial';
        ctx.fillStyle = 'blue';

        // Facteur de conversion px vers mm (approximatif)
        const PX_TO_MM = 0.26;

        // Afficher uniquement les longueurs des côtés
        this.sides.forEach((side, index) => {
            const midX = (this.points[index].x + this.points[(index + 1) % 3].x) / 2;
            const midY = (this.points[index].y + this.points[(index + 1) % 3].y) / 2;
            const sideInMm = Math.round(side * PX_TO_MM);
            ctx.fillText(`${sideInMm}mm`, midX, midY);
        });
    }
}

// Tableau pour stocker les caractéristiques sélectionnées
let selectedCharacteristics = new Set();

function toggleCharacteristic(characteristic) {
    const button = document.querySelector(`button[data-type="${characteristic}"]`);
    if (selectedCharacteristics.has(characteristic)) {
        selectedCharacteristics.delete(characteristic);
        button.classList.remove('selected');
    } else {
        selectedCharacteristics.add(characteristic);
        button.classList.add('selected');
    }
}

function generateNewTriangle() {
    currentTriangle = new Triangle();
    selectedCharacteristics.clear();
    
    // Réinitialiser l'apparence des boutons
    document.querySelectorAll('.options button').forEach(button => {
        button.classList.remove('selected');
    });
    
    const canvas = document.getElementById('triangleCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentTriangle.draw(ctx);

    // Afficher uniquement les longueurs dans la légende
    const legend = document.getElementById('legend');
    const PX_TO_MM = 0.26;
    if (legend) {
        legend.innerHTML = `
            <p>Côtés: ${currentTriangle.sides.map(s => Math.round(s * PX_TO_MM) + 'mm').join(', ')}</p>
        `;
    }
}

function checkAnswer() {
    const resultDiv = document.getElementById('result');
    const scoreDiv = document.getElementById('score');
    
    // Convertir les ensembles en tableaux pour la comparaison
    const selectedArray = Array.from(selectedCharacteristics).sort();
    const correctArray = Array.from(currentTriangle.types).sort();
    
    const isCorrect = JSON.stringify(selectedArray) === JSON.stringify(correctArray);
    
    if (isCorrect) {
        resultDiv.style.color = 'green';
        resultDiv.textContent = 'Correct ! Bien joué !';
        score++;
    } else {
        resultDiv.style.color = 'red';
        resultDiv.textContent = `Incorrect. Les caractéristiques correctes étaient : ${correctArray.join(', ')}`;
    }
    
    scoreDiv.textContent = `Score: ${score}`;
    
    setTimeout(() => {
        resultDiv.textContent = '';
        generateNewTriangle();
    }, 3000);
}

// Générer le premier triangle au chargement
window.onload = generateNewTriangle; 